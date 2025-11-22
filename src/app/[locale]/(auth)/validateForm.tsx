/*
 Mô tả: Hàm kiểm tra dữ liệu form cho các màn hình xác thực (đăng ký/đăng nhập).
 Trả về một object chứa lỗi theo từng trường, rỗng nếu dữ liệu hợp lệ.
 Lưu ý: Chỉ chuyển sang TypeScript, không thay đổi logic.
*/

type RegisterForm = {
  phone: string;
  password: string;
  confimPassword: string;
  fullname: string;
  gender: string;
  birthday: string;
};

type LoginForm = {
  phone: string;
  password: string;
};

type FormData = RegisterForm | LoginForm;
type FormStatus = 'register' | 'login';

export function validateForm(data: FormData, status: FormStatus): Record<string, string> {
  const errors: Record<string, string> = {};

  if (status === 'register') {
    // Phone
    const phoneRegex = /^\d{10,11}$/;
    if (!data.phone) {
      errors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!phoneRegex.test(data.phone)) {
      errors.phone = 'Số điện thoại phải gồm 10-11 chữ số';
    }

    // Password
    if (!data.password) {
      errors.password = 'Vui lòng nhập mật khẩu';
    }

    // Confirm password
    if (!('confimPassword' in data) || !data.confimPassword) {
      errors.confimPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (data.confimPassword !== data.password) {
      errors.confimPassword = 'Mật khẩu nhập lại không khớp';
    }

    // Full name

    const nameRegex = /^\p{L}+(?: \p{L}+)*$/u;

    if (!('fullname' in data) || !data.fullname) {
      errors.fullname = 'Vui lòng nhập họ và tên';
    } else if (!nameRegex.test(data.fullname)) {
      errors.fullname = 'Tên không hợp lệ';
    }

    // Gender
    if (!('gender' in data) || !data.gender) {
      errors.gender = 'Vui lòng chọn giới tính';
    }

    // Birthday
    if (!('birthday' in data) || !data.birthday) {
      errors.birthday = 'Vui lòng chọn ngày sinh';
    }
  }

  if (status === 'login') {
    const phoneRegex = /^\d{10,11}$/;
    if (!data.phone) {
      errors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!phoneRegex.test(data.phone)) {
      errors.phone = 'Số điện thoại phải gồm 10-11 chữ số';
    }

    if (!data.password) {
      errors.password = 'Vui lòng nhập mật khẩu';
    }
  }

  return errors;
}
