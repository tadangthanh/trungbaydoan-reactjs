import React, { useState } from 'react';

const DateInput = ({ label, value, onChange }: { label: any, value: any, onChange: any }) => {
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');

    const handleDayChange = (e: any) => {
        setDay(e.target.value);
        onChange(`${year}-${month}-${e.target.value}`);
    }

    const handleMonthChange = (e: any) => {
        setMonth(e.target.value);
        onChange(`${year}-${e.target.value}-${day}`);
    }

    const handleYearChange = (e: any) => {
        setYear(e.target.value);
        onChange(`${e.target.value}-${month}-${day}`);
    }

    return (
        <div className="form-group mt-3">
            <label>{label}</label>
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

                    />
                </div>
            </div>
        </div>
    );
}

export default DateInput;
