from flask import Blueprint, jsonify, Response
from flask_jwt_extended import jwt_required
from sqlalchemy import func, text
from models import Bookings, Payment, Users, db
import io
import csv

admin_reports_bp = Blueprint('admin_reports', __name__)

# -------------------------------------------------
# 📊 BOOKING STATUS REPORT
# -------------------------------------------------
@admin_reports_bp.route('/bookings', methods=['GET'])
@jwt_required()
def booking_report():
    data = db.session.query(
        Bookings.status,
        func.count(Bookings.id).label('count')
    ).group_by(Bookings.status).all()

    return jsonify([
        {"status": status, "count": count}
        for status, count in data
    ])


# -------------------------------------------------
# 💰 MONTHLY REVENUE REPORT
# -------------------------------------------------
@admin_reports_bp.route('/revenue', methods=['GET'])
@jwt_required()
def revenue_report():
    data = db.session.query(
        func.to_char(Payment.payment_date, 'YYYY-MM').label('month'),
        func.sum(Payment.amount).label('total')
    ).filter(Payment.status == 'completed') \
     .group_by('month').order_by('month').all()

    return jsonify([
        {"month": month, "total": float(total)}
        for month, total in data
    ])


# -------------------------------------------------
# 👥 USER REGISTRATION REPORT
# -------------------------------------------------
@admin_reports_bp.route('/users', methods=['GET'])
@jwt_required()
def user_report():
    data = db.session.query(
        func.to_char(Users.created_at, 'YYYY-MM').label('month'),
        func.count(Users.id).label('count')
    ).group_by('month').order_by('month').all()

    return jsonify([
        {"month": month, "count": count}
        for month, count in data
    ])


# -------------------------------------------------
# 📥 CSV EXPORT (ALL REPORTS)
# -------------------------------------------------
@admin_reports_bp.route('/csv', methods=['GET'])
@jwt_required()
def download_all_reports_csv():
    output = io.StringIO()
    writer = csv.writer(output)

    # ---------- BOOKINGS ----------
    writer.writerow(['BOOKING REPORT'])
    writer.writerow(['Status', 'Count'])

    booking_data = db.session.query(
        Bookings.status,
        func.count(Bookings.id)
    ).group_by(Bookings.status).all()

    for status, count in booking_data:
        writer.writerow([status, count])

    writer.writerow([])

    # ---------- REVENUE ----------
    writer.writerow(['REVENUE REPORT'])
    writer.writerow(['Month', 'Total Revenue'])

    revenue_data = db.session.execute(text("""
        SELECT to_char(payment_date, 'YYYY-MM') AS month,
               SUM(amount) AS total
        FROM payment
        WHERE status = 'completed'
        GROUP BY month
        ORDER BY month
    """))

    for row in revenue_data:
        writer.writerow([row.month, float(row.total)])

    writer.writerow([])

    # ---------- USERS ----------
    writer.writerow(['USER REGISTRATION REPORT'])
    writer.writerow(['Month', 'Users Joined'])

    user_data = db.session.query(
        func.to_char(Users.created_at, 'YYYY-MM'),
        func.count(Users.id)
    ).group_by('month').order_by('month').all()

    for month, count in user_data:
        writer.writerow([month, count])

    return Response(
        output.getvalue(),
        mimetype='text/csv',
        headers={'Content-Disposition': 'attachment; filename=admin-reports.csv'}
    )
