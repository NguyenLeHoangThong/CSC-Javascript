import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({ phone: '', password: '' });
  const [errors, setErrors] = useState({});

  // Hàm validate dữ liệu
  const validate = (name, value) => {
    let errorMsg = [];

    if (name === 'phone') {
      if (!/^\d+$/.test(value)) {
        errorMsg.push("Số điện thoại chỉ được chứa số");
      }
      if (value.length !== 10 && value.length !== 11) {
        errorMsg.push("Số điện thoại phải có 10 hoặc 11 ký tự");
      }
    }

    if (name === 'password') {
      if (value.length <= 8) {
        errorMsg.push("Mật khẩu phải lớn hơn 8 ký tự");
      }
    }

    return errorMsg;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Cập nhật lỗi ngay khi nhập
    const fieldErrors = validate(name, value);
    setErrors({ ...errors, [name]: fieldErrors });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Kiểm tra lần cuối trước khi submit
    const phoneErrors = validate('phone', formData.phone);
    const passErrors = validate('password', formData.password);

    if (phoneErrors.length === 0 && passErrors.length === 0) {
      console.log("Dữ liệu đăng nhập:", formData);
    } else {
      setErrors({ phone: phoneErrors, password: passErrors });
    }
  };

  // Nút đăng nhập chỉ được bấm (hoặc có hiệu lực) khi không còn lỗi
  const isFormValid = formData.phone && formData.password && 
                      validate('phone', formData.phone).length === 0 && 
                      validate('password', formData.password).length === 0;

  return (
    <div className="login-wrapper">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2 className="login-title">Đăng nhập</h2>
        
        <div className="input-group">
          <input
            type="text"
            name="phone"
            placeholder="Số điện thoại"
            value={formData.phone}
            onChange={handleChange}
            className={errors.phone?.length > 0 ? 'input-error' : ''}
          />
          {errors.phone?.map((err, index) => (
            <p key={index} className="error-text">{err}</p>
          ))}
        </div>

        <div className="input-group">
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={formData.password}
            onChange={handleChange}
            className={errors.password?.length > 0 ? 'input-error' : ''}
          />
          {errors.password?.map((err, index) => (
            <p key={index} className="error-text">{err}</p>
          ))}
        </div>

        <button 
          type="submit" 
          className={`login-button ${!isFormValid ? 'btn-disabled' : ''}`}
          disabled={!isFormValid}
        >
          Đăng nhập
        </button>
      </form>
    </div>
  );
}

export default App;