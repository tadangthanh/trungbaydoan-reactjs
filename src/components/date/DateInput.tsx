import { useState } from 'react';

const DateInput = ({ label, value, onChange }: { label: any, value: any, onChange: any }) => {
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [yearError, setYearError] = useState('');
    const handleDayChange = (e: any) => {
        setDay(e.target.value);
        onChange(`${year}-${month}-${e.target.value}`);
    }

    const handleMonthChange = (e: any) => {
        setMonth(e.target.value);
        onChange(`${year}-${e.target.value}-${day}`);
    }

    const handleYearChange = (e: any) => {
        const newYear = e.target.value;
        setYear(newYear);
        // Check if the year is in the format 2xxx
        const yearPattern = /^2\d{3}$/;
        if (!yearPattern.test(newYear)) {
            setYearError('Năm không hợp lệ, bắt đầu từ 2000');
        } else {
            setYearError('');
        }

        // Call onChange only if the year is valid
        if (yearPattern.test(newYear)) {
            onChange(`${newYear}-${month}-${day}`);
        }
    }

    return (
        <div className="form-group mt-3">
            <label>
                {label} <span style={{ color: 'red' }}>*</span>
            </label>
            <div className="row">
                <div className="col-3">
                    <select className="form-control" value={day} onChange={handleDayChange} >
                        <option value="">Ngày</option>
                        {[...Array(31)].map((_, index) => (
                            <option key={index + 1} value={index + 1}>{index + 1}</option>
                        ))}
                    </select>
                </div>
                <div className="col-3">
                    <select className="form-control" value={month} onChange={handleMonthChange} >
                        <option value="">Tháng</option>
                        {[...Array(12)].map((_, index) => (
                            <option key={index + 1} value={index + 1}>{index + 1}</option>
                        ))}
                    </select>
                </div>
                <div className="col-3">
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Năm"
                        value={year}
                        onChange={handleYearChange}
                        {...(yearError && { style: { borderColor: 'red' } })}
                    />

                </div>
            </div>
            {yearError && <small className="text-danger">{yearError}</small>}
        </div>
    );
}

export default DateInput;
