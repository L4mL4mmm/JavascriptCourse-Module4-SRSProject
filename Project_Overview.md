# TÀI LIỆU GIẢI THÍCH CHI TIẾT MÃ NGUỒN TOÀN BỘ PROJECT

Tài liệu này giải thích chi tiết mục đích, cách hoạt động và công dụng của từng khối code trong mọi file thuộc dự án **Task Management Web App** (MySQL + Prisma 7 + Express.js).

---

## 1. CẤU TRÚC THƯ MỤC & FILE KHỞI TẠO CHUNG

### 1.1. [main.js](file:///c:/User/Dev/Practice/Module%204/SRS/main.js) (Điểm chạy chính của Server)
File này chịu trách nhiệm khởi chạy Express Server, cấu hình middleware và kết nối các router.

* **Khối nạp cấu hình và biến môi trường:**
  ```javascript
  import dotenv from 'dotenv';
  dotenv.config();
  ```
  *Công dụng:* Nạp các biến lưu trữ trong file `.env` (như `PORT`, `DATABASE_URL`, `JWT_SECRET`) vào biến toàn cục `process.env`.
* **Khối import thư viện và router:**
  ```javascript
  import express from 'express';
  import bodyParser from 'body-parser';
  import api from './api.js';
  import { errorHandler } from './middlewares/error.middleware.js';
  ```
  *Công dụng:* Nạp framework Express, thư viện đọc request body (`body-parser`), tệp định tuyến trung tâm `api.js` và middleware xử lý lỗi `errorHandler`.
* **Khối khởi tạo ứng dụng Express:**
  ```javascript
  const app = express();
  const port = process.env.PORT || 3000;
  app.use(bodyParser.json());
  ```
  *Công dụng:* Khởi tạo server, đọc cấu hình cổng chạy (ưu tiên lấy từ `.env`, nếu không có thì mặc định chạy cổng `3000`), và đăng ký middleware đọc dữ liệu dạng JSON gửi lên từ client.
* **Khối điều hướng chính và bắt lỗi toàn cục:**
  ```javascript
  app.use("/api", api);
  app.use(errorHandler);
  ```
  *Công dụng:* Mọi URL bắt đầu bằng `/api` sẽ được gửi vào router trung tâm. Middleware `errorHandler` được đặt ở cuối cùng để bắt giữ tất cả các lỗi xảy ra trong ứng dụng.

---

### 1.2. [api.js](file:///c:/User/Dev/Practice/Module%204/SRS/api.js) (Bộ điều hướng Router trung gian)
Đóng vai trò như một ngã tư giao thông, nhận request gửi vào `/api` và phân phối đến các Controller tương ứng.

* **Khối khai báo và nạp Controller:**
  ```javascript
  import express from 'express';
  const router = express.Router();
  
  import categoryRouter from './controllers/category.controller.js'
  import productRouter from './controllers/product.controller.js'
  import authRouter from './controllers/auth.controller.js'
  import projectRouter from './controllers/project.controller.js'
  import taskRouter from './controllers/task.controller.js'
  import statRouter from './controllers/stat.controller.js'
  ```
  *Công dụng:* Khởi tạo bộ định tuyến `express.Router()` và nạp toàn bộ các controller xử lý chức năng.
* **Khối ánh xạ URL (Mapping):**
  ```javascript
  router.use("/categories", categoryRouter); // API quản lý danh mục (cũ)
  router.use("/products", productRouter);    // API quản lý sản phẩm (cũ)
  
  router.use("/v1/auth", authRouter);        // API Đăng ký & Đăng nhập
  router.use("/v1/projects", projectRouter);  // API Quản lý Dự án
  router.use("/v1", taskRouter);             // API Quản lý Công việc (chứa /projects/:id/tasks và /tasks/:id)
  router.use("/v1", statRouter);             // API Báo cáo Thống kê
  ```
  *Công dụng:* Định nghĩa tiền tố URL cho từng module chức năng để chuyển tiếp xử lý.

---

### 1.3. [db.js](file:///c:/User/Dev/Practice/Module%204/SRS/db.js) (Cấu hình Kết nối CSDL MySQL qua Prisma 7)
Chịu trách nhiệm tạo kết nối duy nhất đến CSDL sử dụng MariaDB driver adapter.

* **Khối phân tích chuỗi kết nối:**
  ```javascript
  const dbUrl = new URL(process.env.DATABASE_URL);
  ```
  *Công dụng:* Phân tích chuỗi kết nối dạng `mysql://user:pass@host:port/database` thành một đối tượng chứa đầy đủ thông tin để cấu hình adapter.
* **Khối cấu hình Driver Adapter:**
  ```javascript
  const adapter = new PrismaMariaDb({
    host: dbUrl.hostname || "localhost",
    port: parseInt(dbUrl.port) || 3306,
    user: dbUrl.username || "root",
    password: decodeURIComponent(dbUrl.password) || "",
    database: dbUrl.pathname.replace(/^\//, "")
  });
  ```
  *Công dụng:* Khởi tạo Driver Adapter kết nối CSDL MySQL/MariaDB bằng mã JavaScript thuần.
* **Khối tạo và xuất Prisma Client:**
  ```javascript
  const prisma = new PrismaClient({ adapter });
  export default prisma;
  ```
  *Công dụng:* Khởi tạo đối tượng `prisma` đại diện cho kết nối CSDL và xuất ra (export) để mọi model khác trong dự án có thể import và thực hiện câu lệnh truy vấn.

---

### 1.4. [prisma.config.js](file:///c:/User/Dev/Practice/Module%204/SRS/prisma.config.js) (Cấu hình Prisma CLI trong Prisma 7)
*Công dụng:* Prisma 7 không còn cho phép đặt chuỗi kết nối `url = env(...)` trực tiếp trong file `schema.prisma`. File này đóng vai trò khai báo thông tin kết nối và đường dẫn schema cho Prisma CLI khi bạn chạy lệnh như `npx prisma db push` hoặc `npx prisma generate`.

---

## 2. TẦNG CƠ SỞ DỮ LIỆU (Database Schema)

### 2.1. [prisma/schema.prisma](file:///c:/User/Dev/Practice/Module%204/SRS/prisma/schema.prisma) (Định nghĩa Bảng & Quan hệ)
Chứa thiết kế bảng CSDL của toàn bộ hệ thống:

* **Generator Client**: Định nghĩa sinh Prisma Client ra thư mục `./generated` phục vụ `db.js`.
* **Model User**: Lưu người dùng (`id`, `name`, `email`, `password`, `created_at`, `updated_at`).
* **Model Project**: Lưu dự án. Có quan hệ một-nhiều với User (`owner`) qua trường `owner_id`. Thiết lập `onDelete: Cascade` trên khóa ngoại để khi xóa dự án, mọi dữ liệu phụ thuộc tự động bị xóa theo.
* **Model ProjectMember**: Bảng quan hệ nhiều-nhiều liên kết `User` và `Project`. Lưu danh sách thành viên được thêm vào dự án. Cấu hình ràng buộc duy nhất `@@unique([project_id, user_id])` để ngăn chặn việc thêm trùng lặp một thành viên vào một dự án.
* **Model Task**: Lưu công việc trực thuộc dự án. Chứa các trường trạng thái (`TaskStatus`: `todo`/`doing`/`done`), độ ưu tiên (`TaskPriority`: `low`/`medium`/`high`), thời hạn (`due_date`) và liên kết người được giao (`assignee_id`).

---

## 3. TẦNG TIỆN ÍCH & TRUNG GIAN (Utils & Middlewares)

### 3.1. [utils/response.js](file:///c:/User/Dev/Practice/Module%204/SRS/utils/response.js) (Helper Chuẩn hóa JSON phản hồi)
```javascript
export const sendResponse = (res, statusCode, success, message, data = null) => {
  return res.status(statusCode).json({ success, message, data });
};
```
*Công dụng:* Hàm tiện ích dùng chung để định dạng mọi kết quả trả về của API theo cấu trúc chuẩn:
```json
{
  "success": true / false,
  "message": "Thông báo thao tác",
  "data": { ... } // Dữ liệu payload hoặc null
}
```

---

### 3.2. [middlewares/error.middleware.js](file:///c:/User/Dev/Practice/Module%204/SRS/middlewares/error.middleware.js) (Xử lý lỗi tập trung)
```javascript
export const errorHandler = (err, req, res, next) => {
  console.error("Error caught by global handler:", err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return sendResponse(res, statusCode, false, message);
};
```
*Công dụng:* Bắt giữ bất kỳ lỗi runtime nào xảy ra trong ứng dụng. Nó in stack trace lỗi ra màn hình console của lập trình viên và trả về mã HTTP thích hợp (mặc định là `500 Internal Server Error`) kèm thông báo dạng JSON cho client giúp ứng dụng không bị sập (crash).

---

### 3.3. [middlewares/auth.middleware.js](file:///c:/User/Dev/Practice/Module%204/SRS/middlewares/auth.middleware.js) (Xác thực JWT & Phân quyền Chủ dự án)
* **Khối `verifyToken` (Xác thực JWT)**:
  ```javascript
  const authHeader = req.headers['authorization'];
  ...
  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  ```
  *Cách hoạt động:* Đọc token từ header có dạng `Bearer <Token_Gửi_Lên>`. Giải mã Token qua khóa mật `JWT_SECRET`. Nếu hợp lệ, thông tin người dùng được giải mã (ID, email, tên) sẽ được lưu vào thuộc tính `req.user` để các API xử lý phía sau lấy thông tin người dùng đang thực hiện request.
* **Khối `isProjectOwner` (Phân quyền Owner)**:
  *Cách hoạt động:* 
    1. Đọc mã dự án (`projectId`) từ url param (`req.params.id` hoặc `req.params.projectId`).
    2. Nếu request thao tác trực tiếp trên công việc (`tasks/:id`), middleware sẽ truy vấn db tìm xem công việc đó thuộc về dự án nào để lấy `projectId`.
    3. Truy vấn bảng `projects` để lấy trường `owner_id` (chủ dự án).
    4. So khớp: `project.owner_id !== req.user.id`. Nếu không bằng nhau, lập tức trả về mã `403 Forbidden` kèm thông báo "Chỉ chủ dự án mới có quyền thực hiện". Nếu bằng nhau, cho phép chạy tiếp bằng lệnh `next()`.

---

## 4. TẦNG DỮ LIỆU (Models)

Các file trong thư mục `models/` đại diện cho tầng giao tiếp dữ liệu (Data Access Layer), trực tiếp viết các truy vấn thông qua Prisma Client.

### 4.1. [user.model.js](file:///c:/User/Dev/Practice/Module%204/SRS/models/user.model.js) (Model Người dùng)
* **`findByEmail(email)`**: Tìm kiếm người dùng bằng email dùng `prisma.user.findUnique`. Phục vụ kiểm tra trùng email khi đăng ký và tìm thông tin người dùng khi đăng nhập.
* **`findById(id)`**: Lấy thông tin user bằng ID.
* **`create(data)`**: Thêm mới bản ghi user vào bảng `users`.

### 4.2. [project.model.js](file:///c:/User/Dev/Practice/Module%204/SRS/models/project.model.js) (Model Dự án)
* **`create(data)`**: Tạo dự án mới, lưu trữ ngày bắt đầu và kết thúc dưới dạng kiểu dữ liệu `Date`.
* **`findByUserId(userId)`**: Tìm tất cả dự án mà người dùng có liên quan, thông qua câu lệnh:
  ```javascript
  where: { OR: [ { owner_id: id }, { members: { some: { user_id: id } } } ] }
  ```
  *Giải thích:* Lấy dự án do user làm chủ sở hữu **HOẶC** user tham gia làm thành viên.
* **`findById(id)`**: Lấy chi tiết dự án kèm theo thông tin chủ sở hữu (`owner`), danh sách thành viên (`members`) và các công việc liên quan (`tasks`).
* **`addMember(projectId, userId)`**: Thêm một liên kết thành viên vào bảng quan hệ `project_members`.
* **`removeMember(projectId, userId)`**: Xóa thành viên khỏi dự án.
* **`isMember(projectId, userId)`**: Kiểm tra xem user có phải thành viên dự án không.

### 4.3. [task.model.js](file:///c:/User/Dev/Practice/Module%204/SRS/models/task.model.js) (Model Công việc)
* **`create(data)`**: Tạo mới một công việc và liên kết với dự án, gán người được phân công (nếu có).
* **`update(id, data)`**: Cập nhật thông tin công việc, hỗ trợ ngắt kết nối (disconnect) người được giao việc nếu truyền `assignee_id = null`.
* **`updateStatus(id, status)`**: Hàm chuyên biệt cập nhật nhanh trạng thái công việc (`todo`, `doing`, `done`).
* **`findTasks(projectId, filters)` (Hàm cốt lõi của Tìm kiếm, Lọc & Phân trang)**:
  *Cách hoạt động:*
  1. Đọc và gán mặc định các giá trị phân trang: `page = 1`, `limit = 10`, `skip = (page - 1) * limit`.
  2. Tạo bộ lọc động `where`: Lọc theo trạng thái (`status`), mức độ ưu tiên (`priority`), người được giao (`assignee_id`), tìm kiếm không dấu/có dấu của tiêu đề (`contains: search`).
  3. Sử dụng `Promise.all` để chạy song song 2 câu lệnh nhằm tăng tốc độ xử lý:
     * `prisma.task.findMany`: Lấy danh sách công việc thỏa mãn bộ lọc kèm phân trang (`skip`, `take`).
     * `prisma.task.count`: Đếm tổng số lượng công việc thỏa mãn bộ lọc để phục vụ phân trang.
  4. Trả về kết quả gồm: danh sách `tasks`, `totalItems` (tổng số việc), `totalPages` (tổng số trang), và `currentPage` (trang hiện tại).

### 4.4. [stat.model.js](file:///c:/User/Dev/Practice/Module%204/SRS/models/stat.model.js) (Model Thống kê)
* **`getProjectStats(projectId)` (Thống kê theo dự án)**:
  *Cách hoạt động:*
  1. Đếm tổng số task của dự án qua `prisma.task.count`.
  2. Gom nhóm các task theo trạng thái qua `prisma.task.groupBy({ by: ['status'], _count: { id: true } })`.
  3. Đếm số task quá hạn bằng cách lọc các task chưa hoàn thành (`status != 'done'`) và có hạn hoàn thành nhỏ hơn thời gian hiện tại (`due_date < new Date()`).
* **`getUserStats(userId)` (Thống kê cá nhân)**:
  *Cách hoạt động:* Đếm tổng số công việc được giao cho user đang đăng nhập và số công việc user đó đã hoàn thành (`status = 'done'`).

---

## 5. TẦNG ĐIỀU HƯỚNG & XỬ LÝ NGHIỆP VỤ (Controllers)

Tầng Controller nhận dữ liệu từ Client thông qua Express routing, thực hiện tiền xử lý và gọi sang Model để truy vấn CSDL.

### 5.1. [auth.controller.js](file:///c:/User/Dev/Practice/Module%204/SRS/controllers/auth.controller.js) (API Xác thực)
* **`POST /register`**:
  1. Kiểm tra đầu vào: email không được trùng lặp qua `UserModel.findByEmail`.
  2. Sử dụng `bcrypt.hash(password, 10)` để băm mật khẩu thành chuỗi mã hóa an toàn trước khi lưu.
  3. Gọi `UserModel.create` để tạo tài khoản, trả về dữ liệu tài khoản và ẩn mật khẩu đi.
* **`POST /login`**:
  1. Tìm tài khoản bằng email.
  2. So khớp mật khẩu qua `bcrypt.compare(password, user.password)`.
  3. Tạo JWT Token chứa thông tin của user qua `jwt.sign` với khóa bí mật và thời hạn hết hạn.
  4. Trả về mã Token cho Client.

### 5.2. [project.controller.js](file:///c:/User/Dev/Practice/Module%204/SRS/controllers/project.controller.js) (API Dự án)
* **`POST /`**: Tạo dự án mới, tự động lấy `owner_id` từ Token đã giải mã (`req.user.id`).
* **`GET /:id`**: Xem chi tiết dự án. Chỉ cho phép chủ sở hữu dự án hoặc người dùng đã được thêm làm thành viên của dự án đó xem thông tin.
* **`PUT /:id` và `DELETE /:id`**: Cập nhật/Xóa dự án, bảo vệ nghiêm ngặt bằng middleware `isProjectOwner`.
* **`POST /:id/members`**: Thêm thành viên vào dự án. Chấp nhận đầu vào dạng `email` hoặc `userId`, kiểm tra người dùng có tồn tại không, đã là chủ dự án hay đã là thành viên hay chưa trước khi thêm.

### 5.3. [task.controller.js](file:///c:/User/Dev/Practice/Module%204/SRS/controllers/task.controller.js) (API Công việc)
* **`POST /projects/:id/tasks`**: Tạo công việc mới trực thuộc dự án. Kiểm tra nếu giao việc (`assignee_id`) thì người đó bắt buộc phải là thành viên hoặc chủ sở hữu của dự án đó.
* **`GET /projects/:id/tasks`**: Lấy danh sách công việc thuộc dự án, hỗ trợ đầy đủ bộ lọc phân trang từ Query params gửi lên.
* **`PATCH /tasks/:id/status`**: API cập nhật nhanh trạng thái công việc. Chỉ chủ sở hữu dự án hoặc thành viên tham gia dự án mới có quyền thực hiện.

### 5.4. [stat.controller.js](file:///c:/User/Dev/Practice/Module%204/SRS/controllers/stat.controller.js) (API Thống kê)
* **`GET /projects/:id/statistics`**: Trả về báo cáo tổng quan về trạng thái tiến độ công việc của dự án (chỉ cho phép owner và thành viên xem).
* **`GET /users/me/statistics`**: Trả về thống kê cá nhân của chính người dùng đang đăng nhập dựa trên `req.user.id`.
