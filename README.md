# Shopee Clone — L'Art de Vivre

Web bán hàng thời trang Indochine Moderne, xây dựng trên Next.js 14 + PostgreSQL.

## 🛠️ Tech Stack
- **Next.js 14** (App Router)
- **PostgreSQL** + **Prisma ORM**
- **Tailwind CSS**
- **NextAuth.js** (authentication)
- **TypeScript**

## 📁 Cấu Trúc
```
app/
├── page.tsx               # Trang chủ (banner, danh mục, sản phẩm)
├── products/
│   ├── page.tsx           # Danh sách sản phẩm (filter, sort, phân trang)
│   └── [id]/page.tsx      # Chi tiết sản phẩm (chọn màu, giỏ hàng)
├── cart/page.tsx          # Giỏ hàng
├── auth/
│   ├── login/page.tsx     # Đăng nhập
│   └── register/page.tsx  # Đăng ký
└── api/
    ├── products/          # API sản phẩm
    ├── categories/        # API danh mục
    ├── cart/              # API giỏ hàng
    └── auth/              # NextAuth + Đăng ký
```

## 🚀 Cài Đặt & Chạy

### 1. Yêu cầu
- Node.js ≥ 18
- PostgreSQL đang chạy

### 2. Cài đặt dependencies
```bash
cd shopee-clone
npm install
```

### 3. Cấu hình môi trường
```bash
cp .env.example .env
# Sửa DATABASE_URL theo PostgreSQL của bạn:
# DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/shopee_clone"
```

### 4. Khởi tạo Database
```bash
npm run db:generate     # Generate Prisma Client
npm run db:push         # Tạo bảng trong PostgreSQL
npm run db:seed         # Seed dữ liệu mẫu
```

### 5. Chạy Development Server
```bash
npm run dev
# Mở http://localhost:3000
```

## 👤 Tài Khoản Demo
- **User:** user@example.com / user123456
- **Admin:** admin@lartdevivre.vn / admin123456

## 🎨 Tính Năng

### Trang Chủ
- Hero banner với overlay gradient
- Grid danh mục với icon emoji và màu thương hiệu
- Sản phẩm bán chạy & mới nhất

### Sản Phẩm
- Lọc theo danh mục (Áo, Quần, Mũ, Tất, Phụ Kiện)
- Lọc theo mức giá
- Sắp xếp: Phổ biến / Mới nhất / Bán chạy / Giá tăng/giảm
- Phân trang
- Card hiển thị badge giảm giá, rating sao, đã bán

### Chi Tiết Sản Phẩm
- **Chọn màu sắc** với swatch và tên màu
- Gallery ảnh (ảnh thay đổi theo màu chọn)
- Chọn số lượng
- Thêm vào giỏ / Mua ngay
- Đánh giá sản phẩm
- Sản phẩm tương tự

### Giỏ Hàng
- Hiển thị màu sắc đã chọn
- Cập nhật số lượng
- Xóa sản phẩm
- Chọn tất cả / từng item
- Tính tổng tiền

### Auth
- Đăng ký / Đăng nhập
- Session JWT với NextAuth

## 🗄️ Database Schema

| Model        | Mô tả                              |
|--------------|------------------------------------|
| User         | Người dùng, phân quyền USER/ADMIN  |
| Category     | Danh mục (có màu đại diện)         |
| Product      | Sản phẩm thời trang                |
| ProductColor | Biến thể màu sắc của sản phẩm      |
| Cart         | Giỏ hàng người dùng               |
| CartItem     | Item trong giỏ (kèm màu chọn)     |
| Order        | Đơn hàng                           |
| Review       | Đánh giá sản phẩm                  |
