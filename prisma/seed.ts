import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const PRODUCT_IMAGES = {
  ao1: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDO30TofJ9T6ID7d3LnlDML-7O3LEgn7qOJnFEG0KAOPFcMvN0MFGQOlpOnau-PlApY73LtCkDP6GBgL4dFdUOgGWFrW4C6avFR2JPsfZ0vuNGbjhfKr5lHuoZgZx8lXgNdPk9UoParBazy0zSfr8wEhoQnN7DOg-tlk6hWh_ATOczGQ12wOJ6PI3qgjHf1xsVDjK3E47zfA9IE_nceR2mjWoofPo1Rq3_m4T3Jf85RStl93rntrdUxwnM3shi4sUrssUVYp1_dOLM',
  ao2: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBj-YcX03_YIFIkXywQNQH1hp6x-1ATRkNnqPgJFxX7SOkYpmS7x4-42_SJJkT-TZzOFaH3c4uXVVES029hKDHHntmtN8IpQBmgR2Tr1Kwp427-FlSuBOTnE02osIHErg2auXI0ti9SWvnjCZMy19A6uegqV1y3IRnFbR9zWxP53BshXNG7NM5LgvKg4mUQN1Lz9UY1wYExXiOtdcndapRK2T78-tbtxEcl5zea6PYuZ7kYQ7MSDYoPQh7lc8Nj1S6Jm0yYPPA4Nhs',
  ao3: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFabPH_tpwoEj0FxrXWtR2zSykIzAT80V2xPfPxo33KVOptJYoDyZZO2ezsmGxLbkrRgre618y3mxJGWm6uNHGcHW6YCso9UlTeqkXdKmK8rEsfJFlR0KnhFvCYGniW_tzWgGq31ja5mh5B7fFlcfx3OkZHyUw78p_5ZKLL_ttLd5PwZHlxRTYCo28Qkm-ETFinOEU0Xyg3ESblXKtoHTgnUEpSr4qiRXiMEBgV9CdbdB5YgLLOnkNHb9Eh6SWlQ_ibTvgHcTeRXA',
  quan1: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhbehQ7WswAq2jBw-N0mGRb-EJzO6z2MUYBv_N75L9EqZj-p8ZjHFaMiZkAa2qbquC46_raSM2xbhQmKRx1fHvN9Q1F48oq4edGSwl0E2uqTeias5Ym8DQhBSGSp4uGL2Chg719OS8qNSPv0UbFvx6NHN0XTHmj8bmhkpLdP9kOUNE52grc6Vp96IUCMIokjdUdYI17e-DZhbbCwyvIcB_ulfKgis7nIbCgjODGwthkFigNCdk3JfvbumxX_ayKo207hYnnJqXM0E',
  mu1: 'https://lh3.googleusercontent.com/aida/AP1WRLuHVJoH2Plz3uyHvXwpNBTE3l44UGAo0v9PDvPXeLxwHDeO16Bd1zZN7KTGoA_KcN7_m35U6PEj-olkDd3DKLiKVVHM10s1MlQo6almxSEHYuIqnQbvVLAC9m-JzkMJ88OhLtUvzXwspaBEOaUsZdkZQnTiAmTHqxwl0wlOua3TmBPssqQnJoSV_gDNyOfBgxZ0b6Kgk1d5zdltSuEsRrkHH5wnJqKdToTVN4Bj3dFJ0AmeoO4Xa7x14pg',
  mu2: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJVp4ggyKp0DzGX_qcS0b1Q_p_lvJONNqHbkRdfdztAbpRsiu7YR68CY-icg_SjLCFL7G3wqaxihpAfd2-0i67nRjjv2D5tyYVAl4wke5n57dSrEBr_8qxYlB4LdN12f6_FVY-8SKSZ6IREgXyZ5hFAkeENtgC7Ctp7xtSCWS61roRpUjYx73-nXJ_Nh3VSOFgzAKHl30aHdCZO5MO-g3Ri8a4AeqDDf99JgvfvHEdxvCS9KmOJGc9A_DyzpTjAvHnOfO7avYxQ4o',
  mu3: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjN8LUPSJMG9lq4Ve6wZOWSHCnOoo9tBo721vsWuqho1yufHlN4f-qUVrCAi0ALiQis3vh3qOitIp7TylUXC8_3tZ94314Aw82epsnlvtM-x9At7dZWksk9lwo5O-boAGEGFdjWltvYXAtVyySYgYvGURUBOTAgNkn2RYLS_AgJhXokCVY_FBp-ygQ26ZHCDf5XoakkuUKEUoTJHur3GPuiy-3Tqre6DcKG3AWxn3cepbbvayAj9eUz6V0Bu5qSLis0Tm1hS90iyU',
  tat1: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAEzMreoNZP3S6Sb7DjZeF9wdvlvGkSHqMofzpiUz6MQi9Dk4iwql8ZhfkgAf2KgRMex3fkR5b8FkfEAXs8LnTPZZSz-p-s1Ig0D8MzDK26kOEKqsf7RNBPFbSh1AbwpG2uVzl7l-3DjfphL29xprZY7WJHTLJMT8_7TtRpFGj_n69AQf6VFMNdELqsgUdqs25RBD0plQWENAkcnuRsrc1s0IlislvicUkmugUoGWLYfInMkDjBeWE1iJHHtpTC5PPI5518kXRTF0',
}

async function main() {
  console.log('🌱 Seeding database...')

  // Categories với màu sắc riêng
  const [catAo, catQuan, catMu, catTat, catPhuKien] = await Promise.all([
    prisma.category.upsert({ where: { slug: 'ao' }, update: {}, create: { name: 'Áo', slug: 'ao', color: '#8B0000' } }),
    prisma.category.upsert({ where: { slug: 'quan' }, update: {}, create: { name: 'Quần', slug: 'quan', color: '#1a3a5c' } }),
    prisma.category.upsert({ where: { slug: 'mu' }, update: {}, create: { name: 'Mũ', slug: 'mu', color: '#2d5a27' } }),
    prisma.category.upsert({ where: { slug: 'tat' }, update: {}, create: { name: 'Tất', slug: 'tat', color: '#5a3e2b' } }),
    prisma.category.upsert({ where: { slug: 'phu-kien' }, update: {}, create: { name: 'Phụ Kiện', slug: 'phu-kien', color: '#7b4f8a' } }),
  ])
  console.log('✅ Categories seeded')

  // Users
  const [adminPw, userPw] = await Promise.all([bcrypt.hash('admin123456', 12), bcrypt.hash('user123456', 12)])
  await Promise.all([
    prisma.user.upsert({ where: { email: 'admin@lartdevivre.vn' }, update: {}, create: { email: 'admin@lartdevivre.vn', password: adminPw, name: 'Admin', role: 'ADMIN' } }),
    prisma.user.upsert({ where: { email: 'user@example.com' }, update: {}, create: { email: 'user@example.com', password: userPw, name: 'Nguyễn Văn An' } }),
  ])
  console.log('✅ Users seeded')

  // Products with color variants
  const productsData = [
    // ===== ÁO =====
    {
      name: 'Áo Linen Cổ Cổ Điển', slug: 'ao-linen-co-co-dien',
      description: 'Áo linen cao cấp với thiết kế cổ điển. Chất liệu 100% linen tự nhiên, thoáng mát, thân thiện với môi trường. Phong cách Indochine Moderne.',
      price: 1500000, salePrice: 1200000, images: [PRODUCT_IMAGES.ao1], categoryId: catAo.id, rating: 4.8, soldCount: 1250,
      colors: [
        { name: 'Trắng Ngà', hex: '#FFF8F0', stock: 20, images: [PRODUCT_IMAGES.ao1] },
        { name: 'Nâu Đất', hex: '#8B6F47', stock: 15, images: [PRODUCT_IMAGES.ao1] },
        { name: 'Xanh Rêu', hex: '#556B2F', stock: 10, images: [PRODUCT_IMAGES.ao1] },
      ]
    },
    {
      name: 'Áo Len Lông Cừu Dáng Dài', slug: 'ao-len-long-cuu-dang-dai',
      description: 'Áo len lông cừu cao cấp, ấm áp và sang trọng. Phom dáng dài thanh lịch, phù hợp mùa đông.',
      price: 5000000, salePrice: 4500000, images: [PRODUCT_IMAGES.ao2], categoryId: catAo.id, rating: 4.9, soldCount: 890,
      colors: [
        { name: 'Đỏ Mận', hex: '#8B0000', stock: 8, images: [PRODUCT_IMAGES.ao2] },
        { name: 'Kem Sữa', hex: '#F5F0E8', stock: 12, images: [PRODUCT_IMAGES.ao2] },
        { name: 'Xám Khói', hex: '#6B6B6B', stock: 10, images: [PRODUCT_IMAGES.ao2] },
        { name: 'Đen Tuyền', hex: '#1A1A1A', stock: 15, images: [PRODUCT_IMAGES.ao2] },
      ]
    },
    {
      name: 'Áo Len Dệt Thừng', slug: 'ao-len-det-thua',
      description: 'Áo len dệt thừng thủ công, kiểu dáng Indochine Moderne. Chất liệu cashmere mix wool cao cấp.',
      price: 2500000, salePrice: 2100000, images: [PRODUCT_IMAGES.ao3], categoryId: catAo.id, rating: 4.7, soldCount: 432,
      colors: [
        { name: 'Beige Cổ Điển', hex: '#C8A97A', stock: 18, images: [PRODUCT_IMAGES.ao3] },
        { name: 'Xanh Navy', hex: '#1B3A6B', stock: 12, images: [PRODUCT_IMAGES.ao3] },
        { name: 'Nâu Cacao', hex: '#5C3317', stock: 8, images: [PRODUCT_IMAGES.ao3] },
      ]
    },
    {
      name: 'Áo Sơ Mi Lụa Vạn Phúc', slug: 'ao-so-mi-lua-van-phuc',
      description: 'Áo sơ mi may từ lụa tơ tằm Vạn Phúc chính gốc. Hoa văn thêu tay tinh xảo, tôn vinh di sản làng nghề.',
      price: 3200000, salePrice: null, images: [PRODUCT_IMAGES.ao1], categoryId: catAo.id, rating: 4.9, soldCount: 320,
      colors: [
        { name: 'Vàng Mật Ong', hex: '#D4A017', stock: 6, images: [PRODUCT_IMAGES.ao1] },
        { name: 'Đỏ Carmine', hex: '#960018', stock: 8, images: [PRODUCT_IMAGES.ao1] },
        { name: 'Lam Ngọc', hex: '#1F75B7', stock: 5, images: [PRODUCT_IMAGES.ao1] },
        { name: 'Tím Hoàng Gia', hex: '#6A0DAD', stock: 4, images: [PRODUCT_IMAGES.ao1] },
      ]
    },
    // ===== QUẦN =====
    {
      name: 'Quần Ống Suông Slate', slug: 'quan-ong-suong-slate',
      description: 'Quần ống suông chất liệu cao cấp, phong cách tối giản thanh lịch. Dễ phối với nhiều loại áo.',
      price: 1800000, salePrice: 1600000, images: [PRODUCT_IMAGES.quan1], categoryId: catQuan.id, rating: 4.6, soldCount: 654,
      colors: [
        { name: 'Đen Thanh Lịch', hex: '#212121', stock: 25, images: [PRODUCT_IMAGES.quan1] },
        { name: 'Xám Bạc', hex: '#9E9E9E', stock: 20, images: [PRODUCT_IMAGES.quan1] },
        { name: 'Be Sáng', hex: '#E8D5B7', stock: 15, images: [PRODUCT_IMAGES.quan1] },
        { name: 'Xanh Chàm', hex: '#1C3A5E', stock: 10, images: [PRODUCT_IMAGES.quan1] },
      ]
    },
    {
      name: 'Quần Cullotte Linen', slug: 'quan-cullotte-linen',
      description: 'Quần cullotte linen thoáng mát, phù hợp thời tiết nhiệt đới. Kiểu dáng tự do, cá tính.',
      price: 1400000, salePrice: 1100000, images: [PRODUCT_IMAGES.quan1], categoryId: catQuan.id, rating: 4.5, soldCount: 445,
      colors: [
        { name: 'Trắng Tinh Khôi', hex: '#FFFFFF', stock: 18, images: [PRODUCT_IMAGES.quan1] },
        { name: 'Xanh Bơ', hex: '#7EB77F', stock: 12, images: [PRODUCT_IMAGES.quan1] },
        { name: 'Hồng Phấn', hex: '#F4A7B9', stock: 10, images: [PRODUCT_IMAGES.quan1] },
      ]
    },
    // ===== MŨ =====
    {
      name: "Mũ Fedora L'Art Classic", slug: 'mu-fedora-lart-classic',
      description: "Mũ fedora chế tác thủ công với lụa Vạn Phúc và chi tiết sơn mài. Biểu tượng thương hiệu WIN WIN.",
      price: 5000000, salePrice: 4500000, images: [PRODUCT_IMAGES.mu1], categoryId: catMu.id, rating: 4.9, soldCount: 210,
      colors: [
        { name: 'Đen Sơn Mài', hex: '#1A1A1A', stock: 5, images: [PRODUCT_IMAGES.mu1] },
        { name: 'Nâu Đồng', hex: '#8B6914', stock: 6, images: [PRODUCT_IMAGES.mu1] },
        { name: 'Kem Vani', hex: '#F3E5AB', stock: 4, images: [PRODUCT_IMAGES.mu1] },
      ]
    },
    {
      name: 'Mũ Rộng Vành Mùa Hè', slug: 'mu-rong-vanh-mua-he',
      description: 'Mũ rộng vành thanh lịch, phù hợp các dịp mùa hè. Chất liệu cói tự nhiên nhập khẩu.',
      price: 950000, salePrice: 850000, images: [PRODUCT_IMAGES.mu2], categoryId: catMu.id, rating: 4.5, soldCount: 788,
      colors: [
        { name: 'Cát Biển', hex: '#D4B896', stock: 20, images: [PRODUCT_IMAGES.mu2] },
        { name: 'Nâu Dừa', hex: '#7B4F2E', stock: 15, images: [PRODUCT_IMAGES.mu2] },
        { name: 'Trắng Muối', hex: '#F8F4EF', stock: 12, images: [PRODUCT_IMAGES.mu2] },
      ]
    },
    {
      name: 'Mũ Lưỡi Trai Twill', slug: 'mu-luoi-trai-twill',
      description: 'Mũ lưỡi trai phong cách tối giản, chất liệu twill cao cấp. Phù hợp phong cách casual & streetwear.',
      price: 750000, salePrice: 650000, images: [PRODUCT_IMAGES.mu3], categoryId: catMu.id, rating: 4.4, soldCount: 324,
      colors: [
        { name: 'Đen Street', hex: '#0D0D0D', stock: 30, images: [PRODUCT_IMAGES.mu3] },
        { name: 'Xanh Army', hex: '#4B5320', stock: 20, images: [PRODUCT_IMAGES.mu3] },
        { name: 'Đỏ Cờ', hex: '#CC0000', stock: 15, images: [PRODUCT_IMAGES.mu3] },
        { name: 'Trắng Clean', hex: '#F5F5F5', stock: 18, images: [PRODUCT_IMAGES.mu3] },
      ]
    },
    // ===== TẤT =====
    {
      name: 'Tất Dệt Kim Cashmere', slug: 'tat-det-kim-cashmere',
      description: 'Tất dệt kim cao cấp với sợi cashmere mịn màng, giữ ấm tuyệt vời. Phom cao cổ sang trọng.',
      price: 550000, salePrice: 450000, images: [PRODUCT_IMAGES.tat1], categoryId: catTat.id, rating: 4.6, soldCount: 1890,
      colors: [
        { name: 'Xám Tro', hex: '#808080', stock: 50, images: [PRODUCT_IMAGES.tat1] },
        { name: 'Đen Cơ Bản', hex: '#1A1A1A', stock: 60, images: [PRODUCT_IMAGES.tat1] },
        { name: 'Nâu Đất Nung', hex: '#A0522D', stock: 35, images: [PRODUCT_IMAGES.tat1] },
        { name: 'Xanh Dương Đậm', hex: '#003399', stock: 25, images: [PRODUCT_IMAGES.tat1] },
        { name: 'Đỏ Rượu Vang', hex: '#722F37', stock: 20, images: [PRODUCT_IMAGES.tat1] },
      ]
    },
    {
      name: 'Tất Gân Thổ Cẩm', slug: 'tat-gan-tho-cam',
      description: 'Tất gân họa tiết thổ cẩm lấy cảm hứng từ thêu tay Việt Nam. Độ co giãn tốt, bền màu.',
      price: 380000, salePrice: 320000, images: [PRODUCT_IMAGES.tat1], categoryId: catTat.id, rating: 4.4, soldCount: 2341,
      colors: [
        { name: 'Đỏ Thổ Cẩm', hex: '#8B1A1A', stock: 80, images: [PRODUCT_IMAGES.tat1] },
        { name: 'Xanh Chàm', hex: '#2E4482', stock: 70, images: [PRODUCT_IMAGES.tat1] },
        { name: 'Vàng Đồng', hex: '#B8860B', stock: 60, images: [PRODUCT_IMAGES.tat1] },
      ]
    },
    // ===== PHỤ KIỆN =====
    {
      name: 'Khăn Lụa Họa Tiết Truyền Thống', slug: 'khan-lua-hoa-tiet-truyen-thong',
      description: 'Khăn lụa tơ tằm thêu tay họa tiết hoa sen, trống đồng. Phụ kiện thanh lịch cho mọi trang phục.',
      price: 1200000, salePrice: 980000, images: [PRODUCT_IMAGES.ao1], categoryId: catPhuKien.id, rating: 4.8, soldCount: 560,
      colors: [
        { name: 'Hồng Đào', hex: '#FF6E7A', stock: 15, images: [PRODUCT_IMAGES.ao1] },
        { name: 'Xanh Ngọc', hex: '#00827F', stock: 12, images: [PRODUCT_IMAGES.ao1] },
        { name: 'Vàng Hoàng Kim', hex: '#CFB53B', stock: 8, images: [PRODUCT_IMAGES.ao1] },
        { name: 'Tím Thủy Tiên', hex: '#9370DB', stock: 6, images: [PRODUCT_IMAGES.ao1] },
      ]
    },
  ]

  for (const { colors, ...prod } of productsData) {
    const product = await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {},
      create: prod,
    })

    // Xóa màu cũ và thêm lại
    await prisma.productColor.deleteMany({ where: { productId: product.id } })
    for (const color of colors) {
      await prisma.productColor.create({
        data: { ...color, productId: product.id }
      })
    }
  }

  console.log(`✅ Created ${productsData.length} products with color variants`)
  console.log('🎉 Seeding done!')
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
