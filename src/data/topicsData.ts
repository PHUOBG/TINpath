import { SubjectTopicId } from '../types';

export interface TopicLesson {
  id: SubjectTopicId;
  code: string;
  title: string;
  grade: '10' | '11' | '12';
  track?: 'ALL' | 'CS' | 'ICT';
  examWeight: string; // e.g. "Chiếm 15-20% đề thi"
  iconName: string;
  summary: string;
  requirements: string[];
  keyConcepts: {
    term: string;
    definition: string;
    example?: string;
  }[];
  theorySections: {
    title: string;
    content: string;
    subPoints?: string[];
    codeSnippet?: string;
  }[];
  practicalTips: string[];
  commonPitfalls: string[];
}

export const TOPIC_LESSONS: Record<SubjectTopicId, TopicLesson> = {
  '12A': {
    id: '12A',
    code: 'Chủ đề 12A',
    title: 'Giới thiệu Trí tuệ Nhân tạo (AI)',
    grade: '12',
    track: 'ALL',
    examWeight: 'Trọng tâm Lớp 12 (~15% lệnh hỏi)',
    iconName: 'sparkles',
    summary: 'Tìm hiểu lịch sử, bản chất, 5 đặc trưng cơ bản của AI (Học, Suy luận, Nhận thức, Hiểu ngôn ngữ, Giải quyết vấn đề), phân loại ANI/AGI và các ứng dụng, cảnh báo đạo đức.',
    requirements: [
      'Giải thích sơ lược khái niệm Trí tuệ nhân tạo (AI - Artificial Intelligence).',
      'Nêu ví dụ minh hoạ cho một số ứng dụng điển hình: điều khiển tự động, chẩn đoán bệnh, nhận dạng chữ viết/tiếng nói/khuôn mặt, trợ lý ảo.',
      'Chỉ ra 5 đặc trưng nhận biết AI: Học, Suy luận, Nhận thức, Hiểu ngôn ngữ, Giải quyết vấn đề.',
      'Phân biệt được AI hẹp (ANI) và AI rộng (AGI), hiểu ý nghĩa phép thử Turing (Turing Test).',
      'Nêu được cảnh báo về đạo đức, an ninh mạng (Deepfake), quyền riêng tư và tác động việc làm.'
    ],
    keyConcepts: [
      {
        term: 'Thuật ngữ AI (1955 - 1956)',
        definition: 'Nhà khoa học John McCarthy đặt ra năm 1955. Hội thảo khoa học Dartmouth năm 1956 chính thức đánh dấu sự ra đời của ngành AI.',
        example: 'Khởi đầu từ hội thảo Dartmouth 1956 tại Mỹ.'
      },
      {
        term: '5 Đặc trưng của AI',
        definition: 'Gồm: (1) Khả năng học (rút trích tri thức từ dữ liệu), (2) Khả năng suy luận (áp dụng luật IF-THEN, logic), (3) Khả năng nhận thức (cảm nhận qua sensor, camera), (4) Khả năng hiểu ngôn ngữ (NLP giao tiếp tiếng nói/văn bản), (5) Khả năng giải quyết vấn đề (tối ưu hóa tình huống phức tạp).',
        example: 'Hệ chuyên gia MYCIN áp dụng luật IF-THEN chẩn đoán nhiễm trùng máu.'
      },
      {
        term: 'AI hẹp (ANI) vs AI rộng (AGI)',
        definition: 'ANI (AI yếu) giải quyết nhiệm vụ cụ thể trong một phạm vi hẹp (AlphaGo, ChatGPT, nhận diện biển báo). AGI (AI mạnh) có trí tuệ tổng quát như con người trên mọi lĩnh vực và vượt qua bài kiểm tra Turing.',
        example: 'ChatGPT, xe tự lái hiện tại vẫn thuộc phạm vi AI hẹp.'
      },
      {
        term: 'Deepfake & Đạo đức AI',
        definition: 'Công nghệ sử dụng học sâu để tạo hình ảnh, giọng nói, video giả mạo người thật. Dữ liệu huấn luyện đúng đắn, không thiên lệch là điều kiện tiên quyết đảm bảo đạo đức AI.',
        example: 'Giả giọng người thân vay tiền, tạo hình ảnh xuyên tạc.'
      }
    ],
    theorySections: [
      {
        title: '1. Bản chất sự khác biệt giữa Con người và Máy tính',
        content: 'Con người có khả năng tư duy, khái quát hóa, suy luận logic và kiểm soát cảm xúc. Máy tính xử lý tính toán dữ liệu lớn cực nhanh và chính xác nhưng không có khả năng tự suy nghĩ nếu không được tích hợp AI.'
      },
      {
        title: '2. Các ứng dụng thực tế nổi bật',
        content: '– Y tế: Hệ chuyên gia y tế MYCIN (chẩn đoán vi khuẩn máu), IBM Watson for Oncology (hỗ trợ điều trị ung thư qua hồ sơ bệnh án).\n– Giao thông: Xe tự lái kết hợp camera + radar/lidar để nhận thức làn đường, vật cản.\n– Giáo dục: Cá nhân hóa lộ trình học, phần mềm giám sát thi chống gian lận.\n– Trợ lý ảo: Siri (Apple), Google Assistant, Bixby (Samsung), Alexa (Amazon).'
      },
      {
        title: '3. Phân biệt AI và Tự động hóa truyền thống',
        content: 'Dây chuyền cơ khí tự động hóa thông thường (như ấm siêu tốc tự ngắt, băng chuyền lắp ráp cố định) chỉ hoạt động theo mạch điện hoặc mã cứng, KHÔNG có khả năng học hỏi hay thích ứng với dữ liệu mới nên không phải là AI.'
      }
    ],
    practicalTips: [
      'Nhớ rõ mốc thời gian: John McCarthy (1955) đặt thuật ngữ, Hội thảo Dartmouth (1956) khai sinh ngành AI.',
      'Hệ chuyên gia MYCIN sử dụng quy tắc logic "IF ... THEN ...", không phải học máy hiện đại.',
      'ChatGPT là AI tạo sinh (Generative AI) và vẫn thuộc nhóm AI hẹp (ANI), chưa phải là AGI.'
    ],
    commonPitfalls: [
      'Nhầm lẫn ấm siêu tốc, dây chuyền lắp ráp máy móc cơ bản là có AI (Sai, chỉ là tự động hóa đơn giản).',
      'Nghĩ rằng AI hiện nay đã có cảm xúc và thấu hiểu trọn vẹn như con người (Hiện tại AI không có cảm xúc).',
      'Nhầm lẫn Robot Sophia do Hanson Robotics chế tạo với Honda hay Tesla.'
    ]
  },
  '12B': {
    id: '12B',
    code: 'Chủ đề 12B',
    title: 'Mạng máy tính và Kết nối mạng',
    grade: '12',
    track: 'ALL',
    examWeight: 'Trọng tâm Lớp 12 (~20% lệnh hỏi)',
    iconName: 'network',
    summary: 'Nắm vững kiến trúc mạng LAN/WLAN/WAN/Internet, thiết bị mạng (Switch, Router, Access Point, Modem), cáp xoắn UTP, cáp quang, giao thức TCP/IP, địa chỉ IPv4/IPv6, hệ thống DNS và thực hành chia sẻ tệp/máy in.',
    requirements: [
      'Phân biệt mạng cục bộ (LAN), mạng cục bộ không dây (WLAN / Wi-Fi) và mạng diện rộng (WAN / Internet).',
      'Nêu chức năng chính của Switch (bộ chuyển mạch 48 cổng, bảng MAC), Router (bộ định tuyến, tìm đường đi tối ưu), Access Point (AP phát Wi-Fi), Modem (điều chế/giải điều chế số <-> tương tự).',
      'Hiểu rõ môi trường truyền dẫn: Cáp xoắn UTP (lõi đồng, giắc RJ-45, CAT 5e 1Gbps, CAT 6 10Gbps) và Cáp quang (truyền ánh sáng, lõi thủy tinh/nhựa trong suốt, singlemode laser vs multimode LED).',
      'Giải thích bộ giao thức TCP/IP: TCP kiểm soát luồng không thất lạc gói tin, IP định tuyến gán địa chỉ nguồn/đích.',
      'Phân tích cấu trúc IPv4 (32 bit, 4 octet) và IPv6 (128 bit, 8 cụm hex). Cơ chế phân giải tên miền DNS.',
      'Thao tác thiết lập chia sẻ dữ liệu (Read, Change, Full Control) và chia sẻ máy in qua mạng LAN trên Windows.'
    ],
    keyConcepts: [
      {
        term: 'Switch (Bộ chuyển mạch)',
        definition: 'Thiết bị trung tâm nối các máy trong cùng mạng LAN bằng dây cáp UTP. Switch xây dựng bảng địa chỉ gồm số hiệu cổng và địa chỉ MAC máy trạm, tạo cầu nối tạm thời giữa cổng gửi và nhận mà không gửi nhầm sang máy khác.',
        example: 'Switch 24/48 cổng trong phòng máy trường học.'
      },
      {
        term: 'Router (Bộ định tuyến)',
        definition: 'Thiết bị quan trọng của mạng WAN, kết nối các mạng LAN khác nhau với nhau và kết nối mạng LAN ra Internet. Router chịu trách nhiệm tìm đường đi tốt nhất (dựa trên thời gian, chi phí, rủi ro) để chuyển gói tin tới đúng địa chỉ IP đích.',
        example: 'Router điều hướng gói tin từ mạng gia đình tới máy chủ Google.'
      },
      {
        term: 'Cáp UTP vs Cáp quang',
        definition: 'Cáp xoắn UTP có 4 đôi dây bện chống nhiễu, lõi kim loại dẫn điện, dùng giắc RJ-45. Cáp quang gồm 3 lớp (lõi core, lớp phản quang cladding, lớp vỏ bảo vệ coating), truyền dữ liệu bằng xung ánh sáng (1 = sáng, 0 = tối).',
        example: 'Cáp quang biển dùng nguồn laser singlemode truyền xa hàng ngàn km.'
      },
      {
        term: 'IPv4 vs IPv6 vs DNS',
        definition: 'IPv4 dài 32 bit (gần 4,3 tỉ địa chỉ, hiện đã cạn kiệt). IPv6 dài 128 bit (2^128 địa chỉ). DNS đóng vai trò như "danh bạ điện thoại", chuyển đổi tên miền dạng chữ (hnue.edu.vn) sang IP dạng số (14.238.1.138).',
        example: 'IPv4: 192.168.1.1 — IPv6: 2402:9d80:85c::1'
      }
    ],
    theorySections: [
      {
        title: '1. Các thiết bị mạng trọng tâm',
        content: '• Switch: Tạo kết nối có dây nội bộ LAN, tra cứu bảng MAC để gửi đích xác cổng nhận.\n• Access Point (AP): Phát sóng Wi-Fi cho laptop, điện thoại kết nối vào LAN. Thường gắn trần nhà để sóng lan xa.\n• Modem: Chuyển đổi tín hiệu số (Digital từ máy tính) thành tín hiệu tương tự (Analog truyền xa qua viễn thông) và ngược lại.\n• Router: Nối mạng LAN với Internet, biên dịch địa chỉ (NAT) và định tuyến gói tin.'
      },
      {
        title: '2. Quyền chia sẻ thư mục trên Windows 10',
        content: '• Read: Người dùng chỉ có quyền đọc nội dung hoặc sao chép tệp tin.\n• Change: Có quyền đọc, ghi, sửa, kích hoạt và xóa tệp tin/thư mục con.\n• Full Control: Toàn quyền cao nhất, bao gồm cả việc phân quyền và gán quyền cho người khác.'
      },
      {
        title: '3. Cách đổi nhị phân sang địa chỉ IPv4',
        content: 'Mỗi octet gồm 8 bit: trọng số lần lượt là 128, 64, 32, 16, 8, 4, 2, 1.\nVí dụ: 11000000 = 128 + 64 = 192.\n10101000 = 128 + 32 + 8 = 168.\n00000010 = 2.\n00000011 = 2 + 1 = 3.\n=> Địa chỉ IP dạng thập phân là: 192.168.2.3'
      }
    ],
    practicalTips: [
      'Ghi nhớ: Hub gửi broadcast tới mọi cổng; Switch chỉ gửi đúng cổng đích nhờ bảng địa chỉ MAC.',
      'TCP là kiểm soát lỗi và thứ tự truyền tin (không mất gói); IP là tìm đường đi (định tuyến).',
      'Mạng Wi-Fi chính là mạng WLAN (mạng cục bộ không dây).'
    ],
    commonPitfalls: [
      'Cho rằng IPv6 dài 6 byte (Sai! IPv6 dài 128 bit = 16 byte, IPv4 dài 32 bit = 4 byte).',
      'Nghĩ rằng máy tính để bàn (Desktop PC) luôn có sẵn Wi-Fi (Sai, máy bàn thường cần cắm thêm Card mạng không dây hoặc kết nối cáp UTP vào Switch).',
      'Nhầm lẫn giữa Modem (biến đổi tín hiệu số/tương tự) với Router (định tuyến).'
    ]
  },
  '12F': {
    id: '12F',
    code: 'Chủ đề 12F',
    title: 'Tạo trang web với HTML và CSS',
    grade: '12',
    track: 'ALL',
    examWeight: 'Trọng tâm Lớp 12 (~20% lệnh hỏi)',
    iconName: 'code',
    summary: 'Nắm vững cấu trúc trang web HTML5, các thẻ định dạng văn bản, danh sách, bảng, siêu liên kết, biểu mẫu form, đa phương tiện iframe và mô hình hộp CSS Box Model, quy tắc bộ chọn (Selector).',
    requirements: [
      'Hiểu cấu trúc tài liệu HTML5: <!DOCTYPE html>, <html>, <head>, <title>, <body>.',
      'Sử dụng các thẻ định dạng: <h1>-<h6>, <p>, <strong>, <em>, <u>.',
      'Tạo siêu liên kết với thẻ <a> và thuộc tính href (đường dẫn tương đối, tuyệt đối, anchor #id).',
      'Tạo bảng <table>, <tr>, <td>, <th>, <caption>.',
      'Tạo danh sách có thứ tự <ol type="..." start="..."> và không thứ tự <ul> với các mục <li>.',
      'Chèn đa phương tiện: <img> (src, alt), <audio controls>, <video controls>, <iframe> nhúng YouTube / Maps.',
      'Xây dựng biểu mẫu <form>: <input> (text, password, checkbox, radio), <textarea>, <select>, <button>, <label for="...">.',
      'Áp dụng CSS: 3 cách (inline, internal <style>, external <link>), Box Model (content, padding, border, margin), CSS display (inline, block), CSS Selectors (.class, #id, element, !important).'
    ],
    keyConcepts: [
      {
        term: 'Cấu trúc phần tử HTML (Element)',
        definition: 'Gồm thẻ mở <tên_thẻ thuộc_tính="giá_trị">, nội dung phần tử, và thẻ đóng </tên_thẻ>. Một số thẻ đơn không có thẻ đóng như <img>, <input>, <br>.',
        example: '<a href="https://moet.gov.vn">Bộ Giáo Dục</a>'
      },
      {
        term: 'Thẻ Biểu Mẫu (Form Elements)',
        definition: '<input type="password"> ẩn mật khẩu dạng dấu chấm; type="radio" tạo nút chọn tròn (trong cùng name chỉ chọn 1); type="checkbox" tạo ô kiểm chọn nhiều; <textarea> nhập văn bản nhiều dòng; <select> tạo dropdown chọn.',
        example: '<input type="radio" name="gender" value="nam">'
      },
      {
        term: 'Mô hình hộp CSS (Box Model)',
        definition: 'Mỗi phần tử gồm 4 lớp từ trong ra ngoài: Content (nội dung) -> Padding (vùng đệm bên trong viền) -> Border (đường viền) -> Margin (khoảng cách lề bên ngoài ngăn cách phần tử lân cận).',
        example: 'margin: 20px tạo khoảng cách 20px với phần tử bên ngoài.'
      },
      {
        term: 'Độ ưu tiên CSS & Selectors',
        definition: '!important có độ ưu tiên cao nhất, tiếp theo là ID selector (#id), Class selector (.class), Element selector (tên thẻ). Nếu cùng độ ưu tiên, quy tắc khai báo sau sẽ ghi đè quy tắc khai báo trước.',
        example: '.highlight { color: red !important; }'
      }
    ],
    theorySections: [
      {
        title: '1. Thẻ Bảng và Danh sách HTML',
        content: '• <table>: Tạo bảng\n• <tr>: Tạo hàng (Table Row)\n• <td>: Tạo ô dữ liệu (Table Data)\n• <th>: Tiêu đề cột (chữ in đậm, canh giữa)\n• <ol start="1" type="1">: Danh sách có thứ tự số\n• <ul>: Danh sách không thứ tự (dấu chấm tròn mặc định)',
        codeSnippet: '<table border="1">\n  <caption>Lịch thi tốt nghiệp</caption>\n  <tr><th>Môn</th><th>Thời gian</th></tr>\n  <tr><td>Tin học</td><td>50 phút</td></tr>\n</table>'
      },
      {
        title: '2. CSS Box Model và Khoảng cách',
        content: '• padding: Khoảng cách từ nội dung chữ đến đường viền border.\n• border: Độ dày, kiểu dáng (solid, dotted, dashed) và màu sắc của viền.\n• margin: Khoảng cách từ đường viền ra ngoài tới các phần tử lân cận.',
        codeSnippet: '.box {\n  width: 300px;\n  padding: 15px; /* Đệm trong */\n  border: 1px solid #202020;\n  margin: 20px auto; /* Lề ngoài căn giữa */\n}'
      },
      {
        title: '3. Khung nội tuyến (iframe)',
        content: 'Dùng để nhúng tài nguyên bên ngoài (như video YouTube dạng nhúng embed, bản đồ Google Maps) vào trang web. Thuộc tính bắt buộc là src, có thể cấu hình width và height.'
      }
    ],
    practicalTips: [
      'Thẻ <title> chỉ được đặt trong <head>, không được đặt trong <body>.',
      'Thẻ <a> dùng thuộc tính href, không phải url hay link hay name.',
      'Thẻ <img> bắt buộc có thuộc tính src và nên có alt; không có thẻ đóng </img>.'
    ],
    commonPitfalls: [
      'Nhầm lẫn giữa padding (khoảng đệm bên trong) và margin (khoảng cách lề bên ngoài).',
      'Viết sai cú pháp CSS: ví dụ dùng font-color thay vì color, hoặc text-color thay vì color.',
      'Quên rằng thẻ <input type="password"> dùng để ẩn ký tự mật khẩu, không có type="hiddenpassword".'
    ]
  },
  '12D': {
    id: '12D',
    code: 'Chủ đề 12D',
    title: 'Giữ gìn tính nhân văn trong thế giới ảo',
    grade: '12',
    track: 'ALL',
    examWeight: 'Kiến thức cốt lõi Lớp 12 (~10% lệnh hỏi)',
    iconName: 'heart',
    summary: 'Ưu và nhược điểm của giao tiếp không gian mạng, các nguy cơ bảo mật, văn hóa ứng xử trực tuyến, tôn trọng bản quyền, quyền riêng tư và đấu tranh với thông tin sai lệch.',
    requirements: [
      'Phân tích được ưu điểm (mọi lúc, mọi nơi, tiết kiệm chi phí, kết nối người khuyết tật) và nhược điểm của giao tiếp mạng.',
      'Nhận biết các hạn chế: thiếu ngôn ngữ cơ thể/cảm xúc, nguy cơ nghiện Internet, giảm kỹ năng viết, rủi ro lộ bí mật đời tư.',
      'Thực hiện ứng xử nhân văn: đồng cảm, chia sẻ thông tin đã kiểm chứng, không tiếp tay bắt nạt mạng, tôn trọng người khác.'
    ],
    keyConcepts: [
      {
        term: 'Giao tiếp mạng',
        definition: 'Giao tiếp trực tuyến giúp thu hẹp khoảng cách địa lý, tiết kiệm thời gian, hỗ trợ người khuyết tật hòa nhập, nhưng dễ gây hiểu lầm do thiếu tín hiệu phi ngôn ngữ (ánh mắt, biểu cảm, cử chỉ).',
        example: 'Giao tiếp văn bản dễ bị hiểu nhầm sắc thái tình cảm.'
      },
      {
        term: 'Quyền riêng tư & An toàn số',
        definition: 'Tránh công khai thông tin cá nhân nhạy cảm (CCCD, địa chỉ, số điện thoại người thân), cảnh giác với các chiêu trò lừa đảo và tin tặc chiếm đoạt tài khoản.',
        example: 'Không chia sẻ mật khẩu hay mã OTP cho bất kỳ ai.'
      }
    ],
    theorySections: [
      {
        title: 'Hành vi nhân văn trên mạng xã hội',
        content: '• Tôn trọng sự khác biệt về dân tộc, tôn giáo, giới tính.\n• Kiểm chứng thông tin từ nguồn chính thống trước khi chia sẻ.\n• Lên tiếng phản đối, báo cáo các hành vi xúc phạm, quấy rối, bạo lực mạng.'
      }
    ],
    practicalTips: [
      'Ghi nhớ: Giao tiếp văn bản thiếu tín hiệu phi ngôn ngữ (nét mặt, giọng nói) là nguyên nhân chính dẫn đến hiểu lầm.',
      'Khi gặp thông tin tiêu cực, sai sự thật: Không tiếp tay lan truyền, cần kiểm chứng hoặc báo cáo.'
    ],
    commonPitfalls: [
      'Cho rằng chia sẻ thông tin người khác vì mục đích vui đùa thì không vi phạm (Sai! Vi phạm quyền riêng tư).'
    ]
  },
  '12G': {
    id: '12G',
    code: 'Chủ đề 12G',
    title: 'Giới thiệu nhóm nghề Dịch vụ và Quản trị',
    grade: '12',
    track: 'ALL',
    examWeight: 'Định hướng nghề nghiệp Lớp 12 (~10% lệnh hỏi)',
    iconName: 'briefcase',
    summary: 'Tìm hiểu 3 nghề CNTT chủ chốt: Nghề Sửa chữa & bảo trì máy tính; Nghề Quản trị mạng và hệ thống; Nghề Bảo mật hệ thống thông tin.',
    requirements: [
      'Nắm rõ công việc chính và yêu cầu kỹ năng của Kĩ thuật viên sửa chữa & bảo trì máy tính.',
      'Nắm rõ nhiệm vụ của chuyên viên Quản trị mạng và hệ thống (cài đặt thiết bị mạng, theo dõi hiệu năng, bảo đảm hoạt động liên tục).',
      'Hiểu vai trò của Kĩ sư an toàn thông tin (bảo mật, thiết lập tường lửa, ngăn chặn mã độc, phòng chống tấn công).'
    ],
    keyConcepts: [
      {
        term: 'Kĩ thuật viên bảo trì máy tính',
        definition: 'Lắp ráp, cài đặt hệ điều hành, thay thế linh kiện phần cứng, diệt virus, kết nối mạng LAN cho máy trạm. KHÔNG bắt buộc phải thành thạo kỹ năng lập trình phần mềm.',
        example: 'Thay ổ cứng SSD, cài đặt lại Windows và kết nối máy in.'
      },
      {
        term: 'Quản trị mạng và hệ thống',
        definition: 'Cấu hình Router, Switch, giám sát lưu lượng mạng, sao lưu dữ liệu, phân quyền tài khoản người dùng nội bộ.',
        example: 'Theo dõi độ trễ mạng và cấu hình tường lửa bảo vệ máy chủ.'
      },
      {
        term: 'Bảo mật hệ thống thông tin',
        definition: 'Phát hiện lỗ hổng an ninh mạng, phòng chống tấn công từ chối dịch vụ (DDoS), mã hóa dữ liệu nhạy cảm.',
        example: 'Đánh giá an toàn hệ thống và ứng cứu sự cố rò rỉ dữ liệu.'
      }
    ],
    theorySections: [
      {
        title: 'Yêu cầu năng lực từng nhóm nghề',
        content: '• Bảo trì máy tính: Hiểu phần cứng, thiết bị ngoại vi, hệ điều hành, kỹ năng giao tiếp hướng dẫn người dùng.\n• Quản trị mạng: Kiến thức sâu về giao thức mạng, cấu trúc hệ thống, sao lưu và khôi phục sau sự cố.\n• Kỹ sư bảo mật: Hiểu sâu về các phương thức tấn công mạng, quy trình kiểm thử xâm nhập, luật An ninh mạng.'
      }
    ],
    practicalTips: [
      'Nghề sửa chữa máy tính KHÔNG đòi hỏi phải biết lập trình phần mềm chuyên sâu.',
      'Quản trị mạng là người giám sát, thiết lập các thông số cấu hình để mạng hoạt động hiệu năng cao nhất.'
    ],
    commonPitfalls: [
      'Cho rằng thợ sửa máy tính phải viết được code phần mềm quản lý nhân sự (Sai!).'
    ]
  },
  '12F_CS': {
    id: '12F_CS',
    code: 'Chủ đề 12F(CS)',
    title: 'Giới thiệu Học máy và Khoa học Dữ liệu',
    grade: '12',
    track: 'CS',
    examWeight: 'Phần riêng Định hướng Khoa học máy tính (CS)',
    iconName: 'cpu',
    summary: 'Tìm hiểu khái niệm Học máy (Machine Learning), phân loại Học có giám sát (Supervised) vs Học không giám sát (Unsupervised), các bước xây dựng mô hình học máy và ứng dụng Khoa học dữ liệu (Data Science).',
    requirements: [
      'Phân biệt mô hình truyền thống (không tham số, cố định công thức) và mô hình học máy (học tham số từ tập dữ liệu huấn luyện).',
      'Phân biệt học có giám sát (có nhãn target y, hồi quy & phân loại) và học không giám sát (không nhãn, phân cụm clustering).',
      'Nắm 5 bước xây dựng ứng dụng học máy: (1) Xác định bài toán, (2) Chuẩn bị dữ liệu huấn luyện, (3) Huấn luyện mô hình (tìm tham số w, b), (4) Đánh giá/kiểm thử mô hình (tập test), (5) Đưa mô hình vào sử dụng.',
      'Hiểu mục tiêu của Khoa học dữ liệu: khai phá tri thức từ dữ liệu lớn (Big Data - đặc trưng 5V) hỗ trợ ra quyết định.'
    ],
    keyConcepts: [
      {
        term: 'Học có giám sát (Supervised Learning)',
        definition: 'Huấn luyện mô hình từ tập dữ liệu đã có nhãn y (ground truth). Ví dụ dự đoán giá nhà dựa vào diện tích, phân loại email rác (Spam/Ham).',
        example: 'Mô hình hồi quy tuyến tính: y = ax + b, tìm tham số a và b tối ưu.'
      },
      {
        term: 'Học không giám sát (Unsupervised Learning)',
        definition: 'Dữ liệu đầu vào không có nhãn. Mô hình tự tìm kiếm các cấu trúc hoặc sự tương đồng tiềm ẩn để gom nhóm (phân cụm).',
        example: 'Gom các bài báo thành 3 nhóm chủ đề tự động.'
      },
      {
        term: 'Tập kiểm thử (Test Set)',
        definition: 'Tập dữ liệu độc lập với tập huấn luyện (training set), dùng để đánh giá độ chính xác thực tế của mô hình trước khi triển khai.',
        example: 'Không bao giờ dùng tập kiểm thử để huấn luyện tham số mô hình.'
      }
    ],
    theorySections: [
      {
        title: 'Quy trình huấn luyện mô hình',
        content: 'Thu thập dữ liệu -> Làm sạch & gán nhãn -> Huấn luyện (tối ưu hóa sai số) -> Đánh giá trên tập kiểm thử độc lập -> Triển khai.'
      }
    ],
    practicalTips: [
      'Ghi nhớ: Bài toán dự đoán giá nhà là học có giám sát (nhãn y là giá nhà).',
      'Khoa học dữ liệu là liên ngành: Khoa học máy tính + Toán học/Thống kê + Tri thức chuyên ngành.'
    ],
    commonPitfalls: [
      'Dùng luôn tập dữ liệu huấn luyện để kiểm thử mô hình (Sai! Phải có tập kiểm thử độc lập).'
    ]
  },
  '12E_ICT': {
    id: '12E_ICT',
    code: 'Chủ đề 12E(ICT)',
    title: 'Thực hành phần mềm tạo trang web',
    grade: '12',
    track: 'ICT',
    examWeight: 'Phần riêng Định hướng Tin học ứng dụng (ICT)',
    iconName: 'layout',
    summary: 'Quy trình thiết kế và xuất bản website bằng công cụ trực tuyến (Google Sites, Wix, Mobirise), cấu trúc đầu trang (Header), thân trang (Body), chân trang (Footer), thanh điều hướng Menu và nhúng form.',
    requirements: [
      'Nắm các bước tạo website: Xác định ý tưởng/bố cục -> Chuẩn bị nội dung tư liệu -> Tạo dự án -> Chỉnh sửa các khối thành phần -> Xem trước (Preview) -> Xuất bản (Publish).',
      'Cấu trúc 3 phần chuẩn của trang web: Header (Logo, Banner, Navigation bar), Body (nội dung, khối bài viết, media), Footer (thông tin liên hệ, bản quyền, link mạng xã hội).',
      'Hiểu rõ: Thanh điều hướng (Menu) thường cố định và giống nhau trên tất cả các trang con trong một website.',
      'Sử dụng các khối nội dung: Textbox, Gallery, Video nhúng YouTube, Biểu mẫu Google Forms.'
    ],
    keyConcepts: [
      {
        term: 'Phần mềm tạo web trực quan',
        definition: 'Cho phép kéo thả thành phần đồ họa để sinh mã HTML tự động mà không đòi hỏi người dùng phải giỏi lập trình sâu.',
        example: 'Google Sites, Mobirise, Wix.'
      },
      {
        term: 'Xuất bản website (Publish)',
        definition: 'Đưa toàn bộ nội dung web lên Internet để mọi người có thể truy cập qua một tên miền hoặc địa chỉ URL cụ thể.',
        example: 'Sau khi Preview không có lỗi thì nhấn Publish.'
      }
    ],
    theorySections: [
      {
        title: 'Cấu trúc thanh điều hướng (Menu)',
        content: 'Thanh điều hướng giúp người dùng chuyển qua lại giữa các trang trong website. Mỗi mục liên kết đến một trang tương ứng. Khi đổi tên trang, liên kết trên menu sẽ tự động cập nhật.'
      }
    ],
    practicalTips: [
      'Trước khi xuất bản (Publish) bắt buộc phải kiểm tra qua chế độ Xem trước (Preview) trên nhiều thiết bị.',
      'Tất cả các trang con trong một website chuẩn đều dùng chung một thanh điều hướng và chân trang.'
    ],
    commonPitfalls: [
      'Nghĩ rằng phần mềm kéo thả chỉ hỗ trợ duy nhất máy tính để bàn (Sai! Giao diện responsive trên cả mobile).'
    ]
  },
  '11F': {
    id: '11F',
    code: 'Chủ đề 11F',
    title: 'Giới thiệu các hệ Cơ sở Dữ liệu',
    grade: '11',
    track: 'ALL',
    examWeight: 'Kiến thức cốt lõi Lớp 11 (~10% lệnh hỏi)',
    iconName: 'database',
    summary: 'Khái niệm CSDL, hệ quản trị CSDL (DBMS), mô hình CSDL quan hệ: Bảng (quan hệ), Bản ghi (hàng/record), Thuộc tính (cột/field), Khoá chính (Primary Key), Khoá ngoại (Foreign Key) và tính toàn vẹn dữ liệu.',
    requirements: [
      'Nắm khái niệm CSDL: tập hợp dữ liệu có liên quan, lưu trữ có tổ chức trên máy tính để phục vụ nhiều người dùng.',
      'Phân biệt CSDL tập trung (lưu trên 1 máy tính) và CSDL phân tán (phân tán trên nhiều máy tính mạng).',
      'Trong mô hình quan hệ: Bảng (Table), Hàng = Bản ghi (Record), Cột = Thuộc tính/Trường (Field).',
      'Hiểu khái niệm Khóa chính (xác định duy nhất một bản ghi) và Khóa ngoại (liên kết giữa hai bảng).'
    ],
    keyConcepts: [
      {
        term: 'Bản ghi (Record) & Thuộc tính (Field)',
        definition: 'Mỗi hàng trong bảng là một bản ghi, thể hiện thông tin về một đối tượng cụ thể. Mỗi cột là một trường dữ liệu (thuộc tính) mang một kiểu dữ liệu xác định.',
        example: 'Hàng: [MSHS01, "Nguyễn Văn A", "12A1"]'
      },
      {
        term: 'Khóa chính (Primary Key)',
        definition: 'Một hoặc một tập hợp thuộc tính mà giá trị của nó xác định duy nhất một bản ghi trong bảng. Giá trị khóa chính không được trùng lặp và không được rỗng (NOT NULL).',
        example: 'Số CCCD hoặc Mã định danh học sinh MaHS.'
      },
      {
        term: 'Khóa ngoại (Foreign Key)',
        definition: 'Thuộc tính của bảng này tham chiếu đến khóa chính của bảng khác nhằm thiết lập mối quan hệ và đảm bảo ràng buộc tham chiếu.',
        example: 'MaLop trong bảng HOCSINH tham chiếu MaLop trong bảng LOPHOC.'
      }
    ],
    theorySections: [
      {
        title: 'Các thao tác cập nhật vs khai thác CSDL',
        content: '• Thao tác Cập nhật: Thêm mới bản ghi, sửa đổi dữ liệu bản ghi, xóa bản ghi.\n• Thao tác Khai thác: Tìm kiếm, lọc dữ liệu, sắp xếp, thống kê và lập báo cáo.'
      }
    ],
    practicalTips: [
      'Sắp xếp danh sách học sinh theo thứ tự tên tăng dần là thao tác KHAI THÁC, không phải cập nhật hồ sơ.',
      'Mỗi bảng có thể có nhiều khóa (ứng viên), nhưng chỉ được chọn 1 khóa làm khóa chính.'
    ],
    commonPitfalls: [
      'Nhầm lẫn hàng là thuộc tính (Sai! Hàng là Bản ghi/Record, Cột mới là Thuộc tính/Field).'
    ]
  },
  '11E_ICT': {
    id: '11E_ICT',
    code: 'Chủ đề 11E(ICT)',
    title: 'Thực hành tạo và khai thác CSDL với SQL',
    grade: '11',
    track: 'ICT',
    examWeight: 'Phần riêng Định hướng Tin học ứng dụng (ICT)',
    iconName: 'table',
    summary: 'Cú pháp ngôn ngữ truy vấn cấu trúc SQL: CREATE TABLE, SELECT, FROM, WHERE, INNER JOIN, ON, ORDER BY, COUNT, PRIMARY KEY, FOREIGN KEY REFERENCES.',
    requirements: [
      'Viết câu lệnh tạo bảng CREATE TABLE với các kiểu dữ liệu VARCHAR, INT, DATE, BOOLEAN, PRIMARY KEY, FOREIGN KEY.',
      'Viết câu truy vấn trích xuất dữ liệu cơ bản: SELECT <cột> FROM <bảng> WHERE <điều_kiện> ORDER BY <cột>.',
      'Viết câu lệnh kết nối hai hoặc nhiều bảng bằng mệnh đề INNER JOIN ... ON ...',
      'Sử dụng các hàm tổng hợp như COUNT, toán tử so sánh =, <>, >, <, BETWEEN ... AND ...'
    ],
    keyConcepts: [
      {
        term: 'Cú pháp SELECT chuẩn',
        definition: 'SELECT danh_sach_cot FROM ten_bang WHERE dieu_kien ORDER BY ten_cot [ASC|DESC];',
        example: 'SELECT hoten, diemTB FROM HOCSINH WHERE diemTB >= 8.0 ORDER BY diemTB DESC;'
      },
      {
        term: 'Kết nối bảng (INNER JOIN)',
        definition: 'Ghép nối các bản ghi từ 2 bảng có cùng giá trị trên trường liên kết.',
        example: 'SELECT H.hoten, L.tenLop FROM HOCSINH H INNER JOIN LOP L ON H.maLop = L.maLop;'
      }
    ],
    theorySections: [
      {
        title: 'Ví dụ truy vấn SQL thực hành',
        content: 'Câu lệnh đếm số học sinh có kết quả Đỗ:\nSELECT COUNT(KetQua) FROM DiemTHPT WHERE KetQua = "Đỗ";\n\nCâu lệnh nối bảng:\nSELECT khachhang.hoten FROM hopdong INNER JOIN khachhang ON hopdong.MaKH = khachhang.MaKH WHERE MONTH(hopdong.ngayKT) = 12;'
      }
    ],
    practicalTips: [
      'Khi viết INNER JOIN phải có mệnh đề ON để xác định điều kiện kết nối khóa ngoại = khóa chính.',
      'Toán tử so sánh trong SQL là =, không phải == như trong Python hay C++.'
    ],
    commonPitfalls: [
      'Dùng toán tử == trong SQL (Sai! Trong chuẩn SQL chỉ dùng =).'
    ]
  },
  '11F_CS': {
    id: '11F_CS',
    code: 'Chủ đề 11F(CS)',
    title: 'Kĩ thuật lập trình & Thuật toán',
    grade: '11',
    track: 'CS',
    examWeight: 'Phần riêng Định hướng Khoa học máy tính (CS)',
    iconName: 'terminal',
    summary: 'Cấu trúc dữ liệu mảng và danh sách liên kết, phương pháp làm mịn dần (stepwise refinement), kiểm thử gỡ lỗi (syntax, runtime, semantic error), đánh giá độ phức tạp thuật toán O-notation, thuật toán sắp xếp (Bubble, Insertion) và tìm kiếm (Linear, Binary).',
    requirements: [
      'Phân biệt Mảng (các phần tử liên tiếp bộ nhớ, truy cập qua chỉ số O(1)) và Danh sách liên kết (nút node chứa data và con trỏ next).',
      'Hiểu phương pháp làm mịn dần và thiết kế chương trình theo mô-đun.',
      'Phân loại 3 loại lỗi: Lỗi cú pháp (Syntax error), Lỗi thời gian chạy (Runtime error), Lỗi ngữ nghĩa/logic (Semantic error).',
      'Đánh giá độ phức tạp thời gian O(1), O(log n), O(n), O(n^2).',
      'Nắm bản chất thuật toán Sắp xếp nổi bọt (Bubble Sort), Sắp xếp chèn (Insertion Sort), Tìm kiếm tuần tự (Linear Search) và Tìm kiếm nhị phân (Binary Search).'
    ],
    keyConcepts: [
      {
        term: 'Tìm kiếm nhị phân (Binary Search)',
        definition: 'Yêu cầu mảng BẮT BUỘC ĐÃ ĐƯỢC SẮP XẾP. Mỗi bước so sánh phần tử giữa mid với giá trị cần tìm K để thu hẹp một nửa phạm vi tìm kiếm. Độ phức tạp O(log n).',
        example: 'Mảng 1000 phần tử chỉ cần tối đa ~10 lần so sánh (2^10 = 1024).'
      },
      {
        term: 'Sắp xếp nổi bọt (Bubble Sort)',
        definition: 'Lặp lại việc so sánh và đổi chỗ 2 phần tử liền kề nếu chúng đứng sai thứ tự. Sau mỗi lượt lặp, phần tử lớn nhất sẽ "nổi" về cuối dãy. Độ phức tạp O(n^2).',
        example: 'Dãy n phần tử cần tối đa n-1 vòng lặp ngoài.'
      },
      {
        term: 'Độ phức tạp O-notation',
        definition: 'T(n) = 2n^2*(n - 2) + 4 = 2n^3 - 4n^2 + 4 => Bậc cao nhất là n^3, độ phức tạp là O(n^3).',
        example: 'Vòng lặp đơn chạy n lần => O(n); 2 vòng lặp lồng nhau => O(n^2).'
      }
    ],
    theorySections: [
      {
        title: 'Mã giả thuật toán Tìm kiếm nhị phân trong Python',
        content: 'Mã nguồn Python chuẩn:',
        codeSnippet: 'def binary_search(A, K):\n    left = 0\n    right = len(A) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if A[mid] == K:\n            return mid\n        elif A[mid] < K:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1'
      }
    ],
    practicalTips: [
      'Tìm kiếm nhị phân chỉ áp dụng được khi dãy số đã được sắp xếp tăng dần hoặc giảm dần.',
      'Lỗi chia cho 0 hoặc truy cập chỉ số ngoài mảng là Lỗi thời gian chạy (Runtime Error).'
    ],
    commonPitfalls: [
      'Áp dụng tìm kiếm nhị phân cho mảng chưa sắp xếp (Sai!).'
    ]
  },
  '10_PYTHON': {
    id: '10_PYTHON',
    code: 'Kiến thức Lớp 10',
    title: 'Lập trình Python cơ bản',
    grade: '10',
    track: 'ALL',
    examWeight: 'Nội dung cốt lõi Lớp 10 (~10% lệnh hỏi)',
    iconName: 'file-code',
    summary: 'Cú pháp Python, biến, kiểu dữ liệu số và chuỗi, cấu trúc rẽ nhánh if-elif-else, vòng lặp for và while, xử lý mảng danh sách list, viết hàm def và giải quyết bài toán cơ bản.',
    requirements: [
      'Hiểu cú pháp thụt lề (indentation) của Python.',
      'Sử dụng các kiểu dữ liệu int, float, str, bool, list.',
      'Cấu trúc vòng lặp for i in range(n) và vòng lặp while điều kiện.',
      'Định nghĩa hàm bằng từ khóa def và lệnh trả về return.'
    ],
    keyConcepts: [
      {
        term: 'Cú pháp thụt lề',
        definition: 'Python dùng khoảng thụt lề (thường là 4 dấu cách) để xác định khối lệnh con thay cho dấu ngoặc nhọn { }.',
        example: 'if x > 0:\n    print("Dương")'
      },
      {
        term: 'Kiểu dữ liệu List',
        definition: 'Mảng động có thể chứa các phần tử thuộc nhiều kiểu dữ liệu khác nhau, chỉ số bắt đầu từ 0 đến len(list) - 1.',
        example: 'fruits = ["Cam", "Xoài", "Táo"]'
      }
    ],
    theorySections: [
      {
        title: 'Các lỗi phổ biến trong Python',
        content: '• Thiếu dấu hai chấm : ở cuối dòng if, for, while, def.\n• Lỗi IndexError khi truy cập chỉ số A[len(A)].\n• Lỗi TypeError khi cộng chuỗi với số mà không ép kiểu qua str() hoặc int().'
      }
    ],
    practicalTips: [
      'Chỉ số mảng trong Python luôn bắt đầu từ 0, chỉ số cuối cùng là len(A) - 1.',
      'Hàm range(1, 100) sẽ sinh các số từ 1 đến 99 (không bao gồm 100).'
    ],
    commonPitfalls: [
      'Nhầm range(n) chạy từ 1 đến n (Thực tế chạy từ 0 đến n-1).'
    ]
  }
};
