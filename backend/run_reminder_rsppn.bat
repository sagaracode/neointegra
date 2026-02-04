@echo off
REM Script untuk menjalankan email reminder RSPPN
REM Created: 5 Februari 2026

echo ========================================
echo EMAIL REMINDER - RSPPN RENEWAL
echo ========================================
echo.

cd /d D:\WEBSITES\backend

echo Mengaktifkan virtual environment...
call venv_fixed\Scripts\activate.bat

echo.
echo Pilih mode pengiriman:
echo 1. Manual Reminder (kirim sekarang)
echo 2. Scheduled Reminder (cek otomatis H-7, H-3, H-1, H-Day)
echo 3. Exit
echo.

set /p choice="Masukkan pilihan (1/2/3): "

if "%choice%"=="1" (
    echo.
    echo Mengirim manual reminder ke web@rsppn.co.id...
    python send_renewal_reminder_rsppn.py
) else if "%choice%"=="2" (
    echo.
    echo Menjalankan scheduled reminder...
    python send_scheduled_reminder_rsppn.py
) else if "%choice%"=="3" (
    echo.
    echo Keluar...
    exit /b 0
) else (
    echo.
    echo Pilihan tidak valid!
    pause
    exit /b 1
)

echo.
echo ========================================
echo SELESAI
echo ========================================
pause
