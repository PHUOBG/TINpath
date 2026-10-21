-- ==============================================================================
-- TINPATH - SEED CHUYÊN ĐỀ (TOPICS) & KHO TRI THỨC SGK CHO AI RAG
-- ==============================================================================

-- 1. KHỞI TẠO DANH MỤC CHỦ ĐỀ CHUẨN GDPT 2018 TRONG BẢNG TOPICS
INSERT INTO public.topics (id, name, track, grade, description)
VALUES
    ('12B', 'Mạng máy tính và Internet', 'ALL', '12', 'Địa chỉ IP, Switch, Router, giao thức TCP/IP, DNS, DHCP'),
    ('11F', 'Hệ cơ sở dữ liệu và Truy vấn SQL', 'ALL', '11', 'Mô hình CSDL quan hệ, Khóa chính, Khóa ngoại, câu lệnh SQL SELECT, JOIN'),
    ('12A', 'Trí tuệ nhân tạo (AI) & Học máy', 'ALL', '12', 'Khái niệm AI, Machine Learning, Học có giám sát, Không giám sát, đạo đức AI'),
    ('12D', 'Đạo đức, pháp luật thế giới ảo', 'ALL', '12', 'Luật An ninh mạng, quyền riêng tư, bản quyền số'),
    ('11F_CS', 'Thuật toán và Kĩ thuật lập trình', 'CS', '11', 'Đệ quy, Tìm kiếm nhị phân, Sắp xếp, độ phức tạp O-notation'),
    ('12G', 'Định hướng nghề nghiệp & Tuyển sinh CNTT', 'ALL', '12', 'Nhóm ngành Máy tính & CNTT, tổ hợp môn A00, A01, D01, D07, điểm chuẩn'),
    ('12F', 'Tạo trang web và thiết kế web', 'ALL', '12', 'HTML, CSS, cấu trúc trang web'),
    ('12F_CS', 'Khoa học dữ liệu & Học máy nâng cao', 'CS', '12', 'Tiền xử lý dữ liệu và thuật toán học máy')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    track = EXCLUDED.track,
    description = EXCLUDED.description;

-- 2. XÓA DỮ LIỆU TRI THỨC CŨ TRONG BẢNG KNOWLEDGE_CHUNKS (NẾU CÓ)
DELETE FROM public.knowledge_chunks;

-- 3. NẠP DỮ LIỆU TRI THỨC SGK TIN HỌC 12 VÀO KNOWLEDGE_CHUNKS

-- 3.1 CHUYÊN ĐỀ 12B: MẠNG MÁY TÍNH VÀ INTERNET
INSERT INTO public.knowledge_chunks (topic_id, book_source, chapter, page_number, chunk_title, content)
VALUES
(
    '12B',
    'SGK Tin học 12 - Kết Nối Tri Thức',
    'Chủ đề B: Mạng máy tính và Internet',
    12,
    'Khái niệm Địa chỉ IP và Phân biệt IPv4 với IPv6',
    'Địa chỉ IP (Internet Protocol address) là định danh duy nhất cho mỗi thiết bị khi tham gia vào mạng máy tính nhằm xác định vị trí và định tuyến gói tin.
- IPv4 (Internet Protocol version 4): Có độ dài 32 bit, được chia thành 4 nhóm (octet), mỗi nhóm 8 bit cách nhau bởi dấu chấm, biểu diễn dưới dạng số thập phân từ 0 đến 255 (Ví dụ: 192.168.1.1). Không gian địa chỉ IPv4 cung cấp khoảng 4.3 tỷ địa chỉ và hiện nay đã cạn kiệt.
- IPv6 (Internet Protocol version 6): Được thiết kế để thay thế IPv4 với độ dài 128 bit, được viết dưới dạng 8 nhóm số hexa (thập lục phân), phân tách bằng dấu hai chấm (Ví dụ: 2001:0db8:85a3:0000:0000:8a2e:0370:7334). IPv6 cung cấp không gian địa chỉ khổng lồ lên tới 2^128 địa chỉ, hỗ trợ bảo mật IPsec tích hợp sẵn và cấu hình tự động.'
),
(
    '12B',
    'SGK Tin học 12 - Kết Nối Tri Thức',
    'Chủ đề B: Mạng máy tính và Internet',
    18,
    'Thiết bị mạng: Phân biệt Switch (Bộ chuyển mạch) và Router (Bộ định tuyến)',
    'Trong kiến trúc mạng LAN và WAN:
- Switch (Bộ chuyển mạch): Hoạt động chủ yếu ở tầng Liên kết dữ liệu (Data Link Layer - Tầng 2 của mô hình OSI). Switch sử dụng bảng địa chỉ MAC (MAC Address Table) để chuyển tiếp khung dữ liệu (frame) chính xác đến cổng của thiết bị đích trong cùng một mạng nội bộ (LAN), giúp hạn chế xung đột tín hiệu và tối ưu băng thông.
- Router (Bộ định tuyến): Hoạt động ở tầng Mạng (Network Layer - Tầng 3 của mô hình OSI). Router chịu trách nhiệm kết nối hai hoặc nhiều mạng khác nhau (ví dụ kết nối mạng LAN gia đình với mạng diện rộng Internet của nhà mạng ISP). Router sử dụng bảng định tuyến (Routing Table) và địa chỉ IP để tìm đường đi ngắn nhất, tối ưu nhất cho gói tin (packet) di chuyển giữa các mạng.'
),
(
    '12B',
    'SGK Tin học 12 - Cánh Diều',
    'Chủ đề B: Mạng máy tính và Internet',
    25,
    'Giao thức mạng TCP/IP, DNS và DHCP',
    'Các giao thức mạng then chốt trong bộ giao thức TCP/IP:
- TCP (Transmission Control Protocol): Giao thức tin cậy hướng kết nối, thực hiện bắt tay 3 bước (three-way handshake), kiểm soát luồng, phát hiện lỗi và truyền lại gói tin bị mất, đảm bảo dữ liệu nhận được đầy đủ và đúng thứ tự.
- UDP (User Datagram Protocol): Giao thức không hướng kết nối, không đảm bảo truyền tin cậy nhưng tốc độ nhanh, phù hợp truyền video trực tiếp, gọi thoại VoIP, livestream.
- DNS (Domain Name System): Hệ thống phân giải tên miền giúp chuyển đổi tên miền dễ nhớ (ví dụ: google.com, tinpath.edu.vn) thành địa chỉ IP số mà máy tính hiểu được.
- DHCP (Dynamic Host Configuration Protocol): Giao thức cấp phát địa chỉ IP động tự động cho các thiết bị khi vừa kết nối vào mạng.'
);

-- 3.2 CHUYÊN ĐỀ 11F: CƠ SỞ DỮ LIỆU QUAN HỆ VÀ TRUY VẤN SQL
INSERT INTO public.knowledge_chunks (topic_id, book_source, chapter, page_number, chunk_title, content)
VALUES
(
    '11F',
    'SGK Tin học 11 - Kết Nối Tri Thức',
    'Chủ đề F: Cơ sở dữ liệu và Hệ quản trị CSDL',
    42,
    'Mô hình CSDL quan hệ: Khóa chính (Primary Key) và Khóa ngoại (Foreign Key)',
    'Trong hệ quản trị cơ sở dữ liệu quan hệ (RDBMS):
- Bảng (Relation / Table): Gồm các cột (Thuộc tính / Fields) và các hàng (Bản ghi / Tuples / Records).
- Khóa chính (Primary Key - PK): Là một hoặc một tập hợp các thuộc tính dùng để xác định duy nhất mỗi bản ghi trong bảng. Giá trị của khóa chính KHÔNG ĐƯỢC phép trùng lặp và KHÔNG ĐƯỢC chứa giá trị rỗng (NOT NULL).
- Khóa ngoại (Foreign Key - FK): Là thuộc tính trong một bảng liên kết đến khóa chính của bảng khác nhằm thiết lập mối quan hệ giữa hai bảng. Khóa ngoại đảm bảo Ràng buộc toàn vẹn tham chiếu (Referential Integrity): giá trị khóa ngoại phải tồn tại ở bảng cha hoặc mang giá trị NULL.'
),
(
    '11F',
    'SGK Tin học 11 - Kết Nối Tri Thức',
    'Chủ đề F: Cơ sở dữ liệu và Hệ quản trị CSDL',
    56,
    'Các câu lệnh truy vấn SQL căn bản: SELECT, WHERE, ORDER BY, GROUP BY, HAVING',
    'Cú pháp chuẩn truy vấn dữ liệu SQL:
1. SELECT column1, column2 FROM table_name: Chọn các cột dữ liệu cần lấy.
2. WHERE condition: Lọc các bản ghi thỏa mãn điều kiện trước khi gom nhóm (ví dụ: WHERE diem_thi >= 8.0).
3. GROUP BY column: Gom nhóm các dòng có cùng giá trị để tính toán tổng hợp (COUNT, SUM, AVG, MAX, MIN).
4. HAVING condition: Lọc điều kiện trên nhóm ĐÃ ĐƯỢC GOM NHÓM bởi GROUP BY (ví dụ: HAVING COUNT(*) > 5). Phân biệt: WHERE lọc từng dòng bản ghi, HAVING lọc nhóm.
5. ORDER BY column [ASC|DESC]: Sắp xếp kết quả tăng dần (ASC mặc định) hoặc giảm dần (DESC).
Thứ tự thực thi câu lệnh SQL: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY.'
),
(
    '11F',
    'SGK Tin học 11 - Cánh Diều',
    'Chủ đề F: Cơ sở dữ liệu và Hệ quản trị CSDL',
    68,
    'Các phép kết nối bảng trong SQL: INNER JOIN, LEFT JOIN, RIGHT JOIN',
    'Khi cần lấy thông tin từ nhiều bảng có quan hệ với nhau:
- INNER JOIN: Trả về các dòng khi có sự khớp dữ liệu giữa khóa ở cả hai bảng A và B. Nếu dòng không có cặp tương ứng sẽ bị loại bỏ.
- LEFT JOIN (LEFT OUTER JOIN): Trả về TẤT CẢ các dòng từ bảng bên trái (bảng A), và các dòng khớp từ bảng bên phải (bảng B). Nếu không có bản ghi khớp ở bảng B, các cột của bảng B sẽ nhận giá trị NULL.
- RIGHT JOIN: Trả về tất cả các dòng từ bảng bên phải và các dòng khớp từ bảng bên trái.
Ví dụ: SELECT h.ho_ten, l.ten_lop FROM hoc_sinh h INNER JOIN lop_hoc l ON h.ma_lop = l.ma_lop;'
);

-- 3.3 CHUYÊN ĐỀ 12A: TRÍ TUỆ NHÂN TẠO (AI) VÀ HỌC MÁY
INSERT INTO public.knowledge_chunks (topic_id, book_source, chapter, page_number, chunk_title, content)
VALUES
(
    '12A',
    'SGK Tin học 12 - Kết Nối Tri Thức',
    'Chủ đề A: Giới thiệu Trí tuệ nhân tạo',
    85,
    'Khái niệm Trí tuệ nhân tạo (AI) và các lĩnh vực nghiên cứu chính',
    'Trí tuệ nhân tạo (Artificial Intelligence - AI) là ngành khoa học và công nghệ nghiên cứu, xây dựng các hệ thống tính toán có khả năng thực hiện các tác vụ đòi hỏi trí thông minh của con người như: nhận thức thị giác, nhận dạng tiếng nói, hiểu ngôn ngữ tự nhiên, học hỏi từ dữ liệu và ra quyết định.
Các lĩnh vực tiêu biểu của AI:
- Học máy (Machine Learning) và Học sâu (Deep Learning).
- Thị giác máy tính (Computer Vision): Nhận dạng khuôn mặt, xe tự hành, phân tích ảnh y tế.
- Xử lý ngôn ngữ tự nhiên (NLP - Natural Language Processing): Dịch tự động, chatbot, mô hình ngôn ngữ lớn (LLM).
- Robot thông minh (Robotics) và Hệ chuyên gia (Expert Systems).'
),
(
    '12A',
    'SGK Tin học 12 - Cánh Diều',
    'Chủ đề A: Giới thiệu Trí tuệ nhân tạo',
    96,
    'Phân biệt Học có giám sát (Supervised Learning) và Học không giám sát (Unsupervised Learning)',
    'Trong Học máy (Machine Learning):
- Học có giám sát (Supervised Learning): Mô hình được huấn luyện trên tập dữ liệu ĐÃ ĐƯỢC GÁN NHÃN (Labeled Data), tức là mỗi dữ liệu đầu vào (X) đi kèm nhãn kết quả mong muốn (Y). Các bài toán phổ biến:
  + Phân loại (Classification): Dự đoán nhãn rời rạc (Ví dụ: Email là Spam hay Not Spam, chẩn đoán bệnh Đúng hay Sai).
  + Hồi quy (Regression): Dự đoán giá trị liên tục (Ví dụ: Dự đoán giá nhà, dự đoán điểm thi THPT).
- Học không giám sát (Unsupervised Learning): Dữ liệu huấn luyện CHƯA ĐƯỢC GÁN NHÃN (Unlabeled Data). Mô hình phải tự phát hiện các quy luật, cấu trúc ẩn bên trong dữ liệu. Các bài toán phổ biến:
  + Phân cụm (Clustering): Gom các khách hàng hoặc tài liệu có đặc điểm tương tự thành các cụm (Ví dụ thuật toán K-Means).
  + Giảm chiều dữ liệu (Dimensionality Reduction).'
),
(
    '12D',
    'SGK Tin học 12 - Kết Nối Tri Thức',
    'Chủ đề D: Đạo đức, pháp luật và văn hóa trong môi trường số',
    108,
    'Đạo đức AI, Quyền riêng tư và Luật An ninh mạng',
    'Khi phát triển và ứng dụng AI trong đời sống:
- Tính thiên vị và công bằng (Bias & Fairness): Dữ liệu thu thập không công bằng có thể khiến AI đưa ra kết luận phân biệt đối xử về giới tính, độ tuổi, vùng miền.
- Quyền riêng tư và bảo vệ dữ liệu cá nhân (Data Privacy): Thu thập dữ liệu người dùng phải được sự đồng ý, tuân thủ Luật An toàn thông tin mạng và Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân.
- Trách nhiệm giải trình và tính minh bạch (Explainability): Hệ thống AI cần có khả năng giải thích nguyên do đưa ra quyết định, đặc biệt trong y tế, pháp lý và tài chính.'
);

-- 3.4 CHUYÊN ĐỀ 11F_CS: THUẬT TOÁN VÀ LẬP TRÌNH NÂNG CAO
INSERT INTO public.knowledge_chunks (topic_id, book_source, chapter, page_number, chunk_title, content)
VALUES
(
    '11F_CS',
    'SGK Tin học 11 - Kết Nối Tri Thức',
    'Chuyên đề CS: Thuật toán và Lập trình nâng cao',
    120,
    'Thuật toán Đệ quy (Recursion) và Điều kiện dừng (Base Case)',
    'Đệ quy là phương pháp lập trình trong đó một hàm tự gọi lại chính nó với kích thước bài toán nhỏ hơn.
Mọi hàm đệ quy chuẩn mực phải có 2 thành phần cốt lõi:
1. Trường hợp cơ sở / Điều kiện dừng (Base Case): Trường hợp bài toán đơn giản nhất có thể trả về kết quả ngay lập tức mà không cần gọi đệ quy tiếp. Nếu thiếu điều kiện dừng, chương trình sẽ rơi vào vòng lặp vô hạn và gây lỗi tràn ngăn xếp (Stack Overflow).
2. Bước đệ quy (Recursive Step): Lời gọi chính hàm đó nhưng với tham số nhỏ dần dần hướng tới điều kiện dừng.
Ví dụ: Tính giai thừa n!
def factorial(n):
    if n <= 1:
        return 1 # Base case
    return n * factorial(n - 1) # Recursive step'
),
(
    '11F_CS',
    'SGK Tin học 11 - Cánh Diều',
    'Chuyên đề CS: Thuật toán và Lập trình nâng cao',
    134,
    'Thuật toán Tìm kiếm nhị phân (Binary Search) và Độ phức tạp thuật toán O(log n)',
    'Thuật toán tìm kiếm nhị phân áp dụng trên mảng ĐÃ ĐƯỢC SẮP XẾP.
Nguyên lý: Tại mỗi bước so sánh phần tử cần tìm với phần tử ở vị trí giữa mảng (mid).
- Nếu giá trị cần tìm bằng mid: Tìm thấy.
- Nếu giá trị cần tìm nhỏ hơn mid: Thu hẹp phạm vi tìm kiếm sang nửa bên trái (right = mid - 1).
- Nếu lớn hơn mid: Thu hẹp phạm vi sang nửa bên phải (left = mid + 1).
Độ phức tạp thời gian:
- Tìm kiếm tuần tự (Linear Search): O(n) - phải duyệt qua từng phần tử.
- Tìm kiếm nhị phân (Binary Search): O(log n) - mỗi lần so sánh loại bỏ được một nửa số lượng phần tử, tối ưu vượt trội cho dữ liệu lớn.'
);

-- 3.5 CHUYÊN ĐỀ 12G: ĐỊNH HƯỚNG NGHỀ NGHIỆP CNTT & THÔNG TIN TUYỂN SINH
INSERT INTO public.knowledge_chunks (topic_id, book_source, chapter, page_number, chunk_title, content)
VALUES
(
    '12G',
    'Cẩm nang Tuyển sinh Đại học & Bộ GD&ĐT',
    'Chủ đề G: Hướng nghiệp Tin học & Công nghệ số',
    1,
    'Các ngành nghề công nghệ thông tin trọng điểm và tổ hợp môn xét tuyển',
    'Các ngành đào tạo đại học nhóm ngành Máy tính và Công nghệ thông tin (Mã nhóm ngành 748):
1. Khoa học máy tính (Computer Science - 7480101): Tập trung vào nền tảng lý thuyết tính toán, thuật toán, phát triển phần mềm hệ thống và nghiên cứu AI/Machine Learning.
2. Kỹ thuật phần mềm (Software Engineering - 7480103): Chuyên về quy trình phát triển ứng dụng web, di động, kiểm thử phần mềm, kiến trúc hệ thống quy mô lớn.
3. Trí tuệ nhân tạo (AI) và Khoa học dữ liệu (Data Science - 7480107/7480109): Phân tích dữ liệu lớn, xây dựng mô hình dự báo và hệ thống thông minh.
4. An toàn thông tin / An ninh mạng (Cybersecurity - 7480202): Bảo vệ hệ thống mạng, phòng chống tấn công mạng và mật mã học.
Tổ hợp xét tuyển phổ biến:
- A00: Toán, Vật lý, Hóa học
- A01: Toán, Vật lý, Tiếng Anh
- D01: Toán, Ngữ văn, Tiếng Anh
- D07: Toán, Hóa học, Tiếng Anh
Theo kỳ thi tốt nghiệp THPT từ năm 2025, môn Tin học được đưa vào tổ hợp xét tuyển đại học của nhiều trường top như Bách Khoa Hà Nội, ĐH Bách Khoa Đà Nẵng, ĐH Công nghệ - ĐHQGHN, ĐH Khoa học Tự nhiên TP.HCM.'
);
