# Hướng dẫn chi tiết kiểm thử Backend API bằng Postman

Tài liệu này hướng dẫn cách cấu hình và chạy các request trong Postman để kiểm thử hệ thống Backend API (Task Management).

---

## 1. Hướng dẫn thiết lập cơ bản trong Postman

### Bước 1: Tạo Collection mới
1. Mở Postman, chọn thẻ **Collections** ở thanh menu bên trái.
2. Nhấn vào biểu tượng dấu cộng `+` -> Chọn **Create new collection**.
3. Đặt tên cho collection, ví dụ: `Task Management Backend`.

### Bước 2: Thiết lập biến môi trường (Environment/Variables) để tối ưu hóa
Thay vì nhập đi nhập lại địa chỉ URL hoặc Token cho từng request, ta sẽ thiết lập biến dùng chung:
1. Nhấn vào tên Collection vừa tạo -> Chọn thẻ **Variables** (ở cửa sổ chính bên phải).
2. Thêm các biến sau:
   - **`baseUrl`**:
     - *Initial Value*: `http://localhost:5000/api`
     - *Current Value*: `http://localhost:5000/api`
   - **`token`**:
     - Để trống ban đầu (sẽ lưu Token sau khi đăng nhập thành công).
3. Nhấn **Save** (hoặc `Ctrl + S`) để lưu lại.

---

## 2. Hướng dẫn chi tiết tạo từng Request

Để tạo một request mới, nhấp chuột phải vào Collection -> Chọn **Add request**.

---

### Request 1: Đăng ký tài khoản (Register)
* **Tên Request**: `1. Register`
* **Method**: `POST`
* **URL**: `{{baseUrl}}/v1/auth/register`
* **Cách thiết lập Body JSON**:
  1. Chọn thẻ **Body** (bên dưới thanh URL).
  2. Chọn kiểu **raw**.
  3. Ở menu thả xuống bên phải cùng dòng, chọn **JSON**.
  4. Nhập nội dung sau:
     ```json
     {
       "name": "Nguyen Van A",
       "email": "vana@example.com",
       "password": "password123"
     }
     ```
  5. Nhấn **Send** để gửi request. Nhận phản hồi thành công (`201 Created`).

---

### Request 2: Đăng nhập & Lưu Token tự động (Login)
* **Tên Request**: `2. Login`
* **Method**: `POST`
* **URL**: `{{baseUrl}}/v1/auth/login`
* **Body (raw - JSON)**:
  ```json
  {
    "email": "vana@example.com",
    "password": "password123"
  }
  ```
* **Mẹo tự động lưu Token (Không cần copy-paste thủ công)**:
  1. Chọn thẻ **Scripts** -> Chọn **Post-response** (hoặc thẻ **Tests** trên các bản cũ).
  2. Viết đoạn code script sau:
     ```javascript
     const response = pm.response.json();
     if (response.success && response.data.token) {
         pm.collectionVariables.set("token", response.data.token);
         console.log("Token đã được lưu vào biến collectionVariables!");
     }
     ```
  3. Nhấn **Send**. Postman sẽ tự động đọc chuỗi token trả về và lưu vào biến `{{token}}`.

---

### Thiết lập Authorization tự động cho các API tiếp theo
Thay vì phải cấu hình Bearer Token cho từng API yêu cầu bảo mật:
1. Nhấp vào **tên Collection** (`Task Management Backend`).
2. Chọn thẻ **Authorization**.
3. Ở ô **Type**, chọn **Bearer Token**.
4. Ở ô **Token**, nhập: `{{token}}`
5. Nhấn **Save**. 
Từ lúc này, tất cả các request con bên trong collection sẽ tự động thừa kế Token này (Hãy đảm bảo thẻ *Authorization* ở các request con được đặt là **Inherit auth from parent**).

---

### Request 3: Tạo dự án mới (Create Project)
* **Tên Request**: `3. Create Project`
* **Method**: `POST`
* **URL**: `{{baseUrl}}/v1/projects`
* **Body (raw - JSON)**:
  ```json
  {
    "name": "Dự án Thiết kế Hệ thống",
    "description": "Nghiên cứu và xây dựng database, router",
    "start_date": "2026-08-24",
    "end_date": "2026-09-05"
  }
  ```
* **Tự động lưu Project ID**:
  Bạn có thể viết script tương tự ở thẻ **Scripts -> Post-response** để lưu `projectId`:
  ```javascript
  const response = pm.response.json();
  if (response.success && response.data.id) {
      pm.collectionVariables.set("projectId", response.data.id);
  }
  ```

---

### Request 4: Mời thành viên (Add Member)
* **Tên Request**: `4. Add Member`
* **Method**: `POST`
* **URL**: `{{baseUrl}}/v1/projects/{{projectId}}/members`
* **Body (raw - JSON)**:
  ```json
  {
    "email": "thib@example.com"
  }
  ```

*(Lưu ý: Hãy chắc chắn tài khoản `thib@example.com` đã được đăng ký trên hệ thống trước đó).*

---

### Request 5: Tạo công việc & Phân công (Create Task)
* **Tên Request**: `5. Create Task`
* **Method**: `POST`
* **URL**: `{{baseUrl}}/v1/projects/{{projectId}}/tasks`
* **Body (raw - JSON)**:
  ```json
  {
    "title": "Cài đặt Prisma ORM",
    "description": "Cấu hình adapter MariaDB và chạy migration",
    "assignee_id": 4, 
    "status": "todo",
    "priority": "medium",
    "due_date": "2026-08-28"
  }
  ```
* **Tự động lưu Task ID**:
  Tại thẻ **Scripts -> Post-response**:
  ```javascript
  const response = pm.response.json();
  if (response.success && response.data.id) {
      pm.collectionVariables.set("taskId", response.data.id);
  }
  ```

---

### Request 6: Cập nhật trạng thái nhanh (Patch Status)
* **Tên Request**: `6. Patch Status`
* **Method**: `PATCH`
* **URL**: `{{baseUrl}}/v1/tasks/{{taskId}}/status`
* **Body (raw - JSON)**:
  ```json
  {
    "status": "doing"
  }
  ```

---

### Request 7: Lấy danh sách công việc & Lọc/Phân trang
* **Tên Request**: `7. Get Tasks (Filter & Paginate)`
* **Method**: `GET`
* **URL**: `{{baseUrl}}/v1/projects/{{projectId}}/tasks?status=doing&page=1&limit=5&search=Prisma`

---

### Request 8: Thống kê dự án
* **Tên Request**: `8. Project Stats`
* **Method**: `GET`
* **URL**: `{{baseUrl}}/v1/projects/{{projectId}}/statistics`

---

### Request 9: Thống kê cá nhân
* **Tên Request**: `9. User Stats`
* **Method**: `GET`
* **URL**: `{{baseUrl}}/v1/users/me/statistics`
