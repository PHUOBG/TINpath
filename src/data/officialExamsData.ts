import { Exam, SingleChoiceQuestion, TrueFalseGroupQuestion } from '../types';

export const OFFICIAL_EXAMS: Exam[] = [
  {
    id: 'de_so_1',
    title: 'Đề số 1 — Đề thi Tốt nghiệp THPT môn Tin học chuẩn cấu trúc Bộ GD&ĐT',
    source: 'Sách Hướng dẫn Ôn thi Tốt nghiệp THPT — NXB Đại học Sư phạm Hà Nội',
    durationMinutes: 50,
    year: 2025,
    difficulty: 'Thi thử tốt nghiệp',
    description: 'Đề thi chuẩn cấu trúc định dạng mới 2025. Gồm Phần I (24 câu trắc nghiệm 4 lựa chọn) và Phần II (4 câu đúng/sai).',
    totalScore: 10,
    baseXP: 100,
    part1Questions: [
      {
        id: 'de1_c1',
        type: 'single_choice',
        topicId: '12A',
        topicName: 'Giới thiệu Trí tuệ Nhân tạo',
        level: 'biet',
        content: 'Phương án nào sau đây đúng khi nói về hạn chế của máy tính?',
        options: {
          A: 'Tự động xử lí dữ liệu theo yêu cầu.',
          B: 'Thực hiện các công việc trí tuệ.',
          C: 'Nhận biết dữ liệu từ thiết bị vào.',
          D: 'Hoạt động không biết mệt mỏi.'
        },
        correctAnswer: 'B',
        explanation: 'Máy tính xử lý dữ liệu lớn rất nhanh và chính xác nhưng không có khả năng tự thực hiện các công việc trí tuệ như con người nếu không được tích hợp AI.'
      },
      {
        id: 'de1_c2',
        type: 'single_choice',
        topicId: '12A',
        topicName: 'Giới thiệu Trí tuệ Nhân tạo',
        level: 'hieu',
        content: 'Phương án nào sau đây thể hiện rõ nhất ứng dụng của trí tuệ nhân tạo?',
        options: {
          A: 'Đèn điều khiển giao thông tại ngã tư tự động đổi màu.',
          B: 'Tự động thanh toán khi quét mã QR trên điện thoại.',
          C: 'Phát ngẫu nhiên một bài hát có sẵn trong danh sách.',
          D: 'Tự động chấm bài thi trắc nghiệm thông qua hình ảnh.'
        },
        correctAnswer: 'D',
        explanation: 'Tự động chấm bài thi qua hình ảnh ứng dụng thị giác máy tính và nhận dạng ký tự/mẫu quang học (OCR) của AI.'
      },
      {
        id: 'de1_c3',
        type: 'single_choice',
        topicId: '12A',
        topicName: 'Giới thiệu Trí tuệ Nhân tạo',
        level: 'hieu',
        content: 'Phát biểu nào sau đây đúng khi nói về bản chất của AI hiện đại?',
        options: {
          A: 'Những hệ thống có khả năng thực hiện công việc tự động theo yêu cầu con người như dây chuyền sản xuất đều là AI.',
          B: 'Phân loại AI thông qua xác định phạm vi dữ liệu học và lượng tri thức hệ thống đã trích rút, nguồn tri thức học được càng rộng thì AI đó được coi là một AI rộng.',
          C: 'Một hệ thống tự động vẫn được coi là một AI hoàn chỉnh dù không có các đặc trưng cơ bản.',
          D: 'Phát triển AI hẹp giải quyết các bài toán đặc thù trong lĩnh vực cụ thể có tính khả thi cao hơn phát triển các AI rộng giải quyết nhiều nhiệm vụ trong nhiều lĩnh vực.'
        },
        correctAnswer: 'D',
        explanation: 'Phát triển AI hẹp (ANI) tập trung vào một tác vụ chuyên biệt có tính khả thi cao và đã ứng dụng rộng rãi, trong khi AI rộng (AGI) là mục tiêu nghiên cứu dài hạn.'
      },
      {
        id: 'de1_c4',
        type: 'single_choice',
        topicId: '12A',
        topicName: 'Giới thiệu Trí tuệ Nhân tạo',
        level: 'van_dung',
        content: 'Cho các thiết bị sau: (1) robot hút bụi hiện đại, (2) máy rút tiền ATM, (3) máy tìm kiếm thông tin, (4) máy dự báo thời tiết, (5) máy in 3D tự động, (6) cánh tay robot sản xuất. Phương án nào sau đây chỉ ra đúng các thiết bị/hệ thống có ứng dụng AI?',
        options: {
          A: '1, 3, 5.',
          B: '1, 3, 4.',
          C: '1, 2, 3.',
          D: '4, 5, 6.'
        },
        correctAnswer: 'B',
        explanation: '(1) robot hút bụi thông minh (nhận thức môi trường, lập bản đồ), (3) máy tìm kiếm thông tin (hiểu ngôn ngữ, xếp hạng thông minh), (4) dự báo thời tiết bằng mô hình AI phân tích dữ liệu khí tượng.'
      },
      {
        id: 'de1_c5',
        type: 'single_choice',
        topicId: '12B',
        topicName: 'Mạng máy tính và Kết nối mạng',
        level: 'biet',
        content: 'Phát biểu nào sau đây mô tả sai về mạng LAN?',
        options: {
          A: 'Còn được gọi là mạng cục bộ.',
          B: 'LAN là từ viết tắt của Local Area Network, nghĩa là "mạng cục bộ".',
          C: 'Là mạng kết nối các máy tính trong phạm vi một cơ quan nhỏ.',
          D: 'Là một dạng đặc biệt của mạng WLAN.'
        },
        correctAnswer: 'D',
        explanation: 'Phát biểu D sai vì WLAN (mạng LAN không dây) mới là một dạng không dây của mạng LAN, chứ không phải LAN là dạng đặc biệt của WLAN.'
      },
      {
        id: 'de1_c6',
        type: 'single_choice',
        topicId: '12B',
        topicName: 'Mạng máy tính và Kết nối mạng',
        level: 'biet',
        content: 'Wi-Fi là loại mạng nào dưới đây?',
        options: {
          A: 'Mạng diện rộng.',
          B: 'Mạng cục bộ không dây (WLAN).',
          C: 'Mạng cục bộ có dây.',
          D: 'Mạng viễn thông toàn cầu.'
        },
        correctAnswer: 'B',
        explanation: 'Wi-Fi (Wireless Fidelity) là tên gọi thông dụng của mạng cục bộ không dây WLAN.'
      },
      {
        id: 'de1_c7',
        type: 'single_choice',
        topicId: '12B',
        topicName: 'Mạng máy tính và Kết nối mạng',
        level: 'hieu',
        content: 'Phát biểu nào dưới đây mô tả đúng về Internet?',
        options: {
          A: 'Được sở hữu bởi tổ chức quốc tế có tên là ICANN.',
          B: 'Không nằm dưới sự quản lí của bất cứ quốc gia, cá nhân, cơ quan hay tổ chức nào.',
          C: 'Được sở hữu bởi tổ chức quốc tế có tên là IETF.',
          D: 'Là một mạng WAN đặc biệt, có phạm vi hoạt động phủ khắp toàn thế giới.'
        },
        correctAnswer: 'D',
        explanation: 'Internet là một mạng WAN đặc biệt quy mô toàn cầu, kết nối các mạng LAN và WAN lại với nhau.'
      },
      {
        id: 'de1_c8',
        type: 'single_choice',
        topicId: '12B',
        topicName: 'Mạng máy tính và Kết nối mạng',
        level: 'biet',
        content: 'Switch là thiết bị kết nối cơ bản của loại mạng nào sau đây?',
        options: {
          A: 'Mạng LAN có dây.',
          B: 'Mạng LAN không dây.',
          C: 'Mạng Wi-Fi.',
          D: 'Mạng vệ tinh.'
        },
        correctAnswer: 'A',
        explanation: 'Switch (Bộ chuyển mạch) là thiết bị nối trung tâm trong mạng LAN có dây sử dụng cáp xoắn UTP.'
      },
      {
        id: 'de1_c9',
        type: 'single_choice',
        topicId: '12F',
        topicName: 'Tạo trang web với HTML và CSS',
        level: 'biet',
        content: 'Để hiển thị văn bản HTML trên trình duyệt web, cần làm công việc nào sau đây?',
        options: {
          A: 'Dịch mã nguồn sang mã nhị phân.',
          B: 'Chạy trực tiếp file HTML trên trình duyệt.',
          C: 'Đưa mã nguồn vào máy chủ web.',
          D: 'Sửa hết lỗi cú pháp trong văn bản HTML.'
        },
        correctAnswer: 'B',
        explanation: 'Trình duyệt web biên dịch và hiển thị trực tiếp các tệp tin có phần mở rộng .html.'
      },
      {
        id: 'de1_c10',
        type: 'single_choice',
        topicId: '12F',
        topicName: 'Tạo trang web với HTML và CSS',
        level: 'biet',
        content: 'Khi muốn hiển thị một đoạn văn bản theo kiểu chữ nghiêng để chỉ ra rằng nó là một cụm từ đặc biệt, sử dụng thẻ nào sau đây?',
        options: {
          A: '<i>',
          B: '<em>',
          C: '<italic>',
          D: '<strong>'
        },
        correctAnswer: 'B',
        explanation: 'Thẻ <em> (emphasized text) dùng để nhấn mạnh văn bản bằng chữ in nghiêng về mặt ngữ nghĩa.'
      },
      {
        id: 'de1_c11',
        type: 'single_choice',
        topicId: '12F',
        topicName: 'Tạo trang web với HTML và CSS',
        level: 'biet',
        content: 'Trong các thẻ sau, thẻ nào không phải là thẻ được sử dụng để nhấn mạnh văn bản trong HTML?',
        options: {
          A: '<strong>',
          B: '<em>',
          C: '<bold>',
          D: '<i>'
        },
        correctAnswer: 'C',
        explanation: 'Trong chuẩn HTML không tồn tại thẻ <bold> (chỉ có <b> hoặc <strong>).'
      },
      {
        id: 'de1_c12',
        type: 'single_choice',
        topicId: '12F',
        topicName: 'Tạo trang web với HTML và CSS',
        level: 'hieu',
        content: 'Cho đoạn mã HTML sau: <h1>Đây là tiêu đề lớn nhất.</h2>. Lỗi trong đoạn mã là gì?',
        options: {
          A: 'Thẻ <title> đặt trong <head> không đúng.',
          B: 'Thiếu kí tự / trong thẻ đóng.',
          C: 'Thẻ <body> khai báo thừa.',
          D: 'Thẻ mở <h1> và thẻ đóng </h2> không tương ứng.'
        },
        correctAnswer: 'D',
        explanation: 'Thẻ mở là <h1> thì thẻ đóng tương ứng phải là </h1>, không được đóng bằng </h2>.'
      },
      {
        id: 'de1_c13',
        type: 'single_choice',
        topicId: '12F',
        topicName: 'Tạo trang web với HTML và CSS',
        level: 'hieu',
        content: 'Đoạn mã HTML sau có lỗi: <a href="www.example.com">Trang chủ</a>. Nguyên nhân lỗi là gì?',
        options: {
          A: 'Thiếu hai dấu gạch chéo (//) trước tên miền.',
          B: 'Thiếu kí tự gạch chéo (/) trước tên miền.',
          C: 'Thiếu giao thức (http:// hoặc https://) trước tên miền.',
          D: 'Thiếu tên tệp tin cần liên kết.'
        },
        correctAnswer: 'C',
        explanation: 'Khi tạo liên kết tuyệt đối trỏ tới website bên ngoài, href bắt buộc phải có tiền tố giao thức như http:// hoặc https://.'
      },
      {
        id: 'de1_c14',
        type: 'single_choice',
        topicId: '12F',
        topicName: 'Tạo trang web với HTML và CSS',
        level: 'biet',
        content: 'Trong các thẻ để chèn một hình ảnh vào văn bản HTML sau đây, thẻ nào được viết đúng cú pháp?',
        options: {
          A: '<image src="image.gif" alt="Ảnh đẹp">',
          B: '<img href="image.gif" alt="Ảnh đẹp">',
          C: '<img src="image.gif" alt="Ảnh đẹp">',
          D: '<img alt="Ảnh đẹp">image.gif</img>'
        },
        correctAnswer: 'C',
        explanation: 'Cú pháp chuẩn của thẻ hình ảnh là <img src="..." alt="..."> và không có thẻ đóng.'
      },
      {
        id: 'de1_c15',
        type: 'single_choice',
        topicId: '12F',
        topicName: 'Tạo trang web với HTML và CSS',
        level: 'van_dung',
        content: 'Thí sinh tra cứu kết quả thi trên trang web, sau khi nhấn chuột vào dòng chữ https://ts2024.abc.edu.vn thì được chuyển đến trang đó. Mã HTML nào thực hiện đúng yêu cầu này?',
        options: {
          A: '<p>Thí sinh tra cứu kết quả tại địa chỉ <a href="http://ts2024.abc.edu.vn">http://ts2024.abc.edu.vn</a></p>',
          B: '<p>Thí sinh tra cứu kết quả tại địa chỉ <a href="http://ts2024.abc.edu.vn"></a></p>',
          C: '<p>Thí sinh tra cứu kết quả tại địa chỉ <a>http://ts2024.abc.edu.vn</a></p>',
          D: '<p>Thí sinh tra cứu kết quả tại địa chỉ <a href="">http://ts2024.abc.edu.vn</a></p>'
        },
        correctAnswer: 'A',
        explanation: 'Thẻ <a> phải có thuộc tính href chứa URL đích và có nội dung văn bản hiển thị giữa thẻ mở và thẻ đóng.'
      },
      {
        id: 'de1_c16',
        type: 'single_choice',
        topicId: '12F',
        topicName: 'Tạo trang web với HTML và CSS',
        level: 'hieu',
        content: 'Bộ chọn CSS nào sau đây sẽ áp dụng kiểu chữ màu đỏ cho tất cả các phần tử <p> trong trang web mà không cần thêm bất kì khai báo nào khác?',
        options: {
          A: 'p {color: red;}',
          B: '.p {color: red;}',
          C: '#p {color: red;}',
          D: 'para {color: red;}'
        },
        correctAnswer: 'A',
        explanation: 'Sử dụng bộ chọn phần tử (Element Selector) có tên thẻ p: p { color: red; }.'
      },
      {
        id: 'de1_c17',
        type: 'single_choice',
        topicId: '12F',
        topicName: 'Tạo trang web với HTML và CSS',
        level: 'hieu',
        content: 'Mã nguồn HTML nào sau đây đúng để tạo liên kết tới địa chỉ trang Web của Bộ Giáo dục và Đào tạo có địa chỉ https://moet.gov.vn?',
        options: {
          A: '<a name="https://moet.gov.vn">Bộ Giáo dục và Đào tạo</a>',
          B: '<a href="https://moet.gov.vn">Bộ Giáo dục và Đào tạo</a>',
          C: '<a url="https://moet.gov.vn">Bộ Giáo dục và Đào tạo</a>',
          D: '<a> https://moet.gov.vn Bộ Giáo dục và Đào tạo </a>'
        },
        correctAnswer: 'B',
        explanation: 'Thẻ <a> sử dụng thuộc tính href="https://moet.gov.vn".'
      },
      {
        id: 'de1_c18',
        type: 'single_choice',
        topicId: '12F',
        topicName: 'Tạo trang web với HTML và CSS',
        level: 'biet',
        content: 'Đoạn mã HTML nào sau đây phù hợp để chèn tệp ảnh mon_ngon.jpg vào một trang web?',
        options: {
          A: '<img src="mon_ngon.jpg" alt="Món ngon nhất">',
          B: '<image src="mon_ngon.jpg" alt="Mô tả ảnh">',
          C: '<image link="mon_ngon.jpg" alt="Món ngon nhất">',
          D: '<img url="mon_ngon.jpg" alt="Mô tả ảnh">'
        },
        correctAnswer: 'A',
        explanation: 'Thẻ <img> sử dụng thuộc tính src="mon_ngon.jpg" và alt="Món ngon nhất".'
      },
      {
        id: 'de1_c19',
        type: 'single_choice',
        topicId: '12D',
        topicName: 'Giữ gìn tính nhân văn trong thế giới ảo',
        level: 'biet',
        content: 'Giao tiếp trong không gian mạng có thể thực hiện ở mọi lúc, mọi nơi, tuy nhiên không có ưu điểm nào sau đây?',
        options: {
          A: 'Không phụ thuộc vào không gian và địa điểm.',
          B: 'Không bị hạn chế về thời gian và khoảng cách.',
          C: 'Người tham gia không cần cùng có mặt tại một thời điểm.',
          D: 'Người tham gia không cần kết nối Internet.'
        },
        correctAnswer: 'D',
        explanation: 'Để giao tiếp trong không gian mạng, các bên bắt buộc phải có kết nối mạng Internet.'
      },
      {
        id: 'de1_c20',
        type: 'single_choice',
        topicId: '12D',
        topicName: 'Giữ gìn tính nhân văn trong thế giới ảo',
        level: 'hieu',
        content: 'Ý kiến nào sau đây không phù hợp về kĩ năng giao tiếp trong không gian mạng?',
        options: {
          A: 'Có thể làm giảm kĩ năng viết, sai chính tả, sai ngữ pháp do viết tắt.',
          B: 'Có thể thiếu tập trung, bị phân tán, giảm hiệu quả tương tác.',
          C: 'Có thể giảm nhẹ các rào cản như tính nhút nhát, e dè.',
          D: 'Luôn luôn cải thiện toàn diện kĩ năng nói và viết của người tham gia.'
        },
        correctAnswer: 'D',
        explanation: 'Giao tiếp mạng nhiều khi lạm dụng biểu tượng cảm xúc, viết tắt bừa bãi có thể làm cùn mòn kỹ năng giao tiếp trực tiếp ngoài đời thực.'
      },
      {
        id: 'de1_c21',
        type: 'single_choice',
        topicId: '12D',
        topicName: 'Giữ gìn tính nhân văn trong thế giới ảo',
        level: 'van_dung',
        content: 'Khi tham gia diễn đàn, một người né tránh không giao lưu với những người theo đạo Hồi. Người này không nhân văn vì không đồng tình với việc nào sau đây?',
        options: {
          A: 'Bắt nạt, quấy rối trên không gian mạng.',
          B: 'Đồng cảm với những người gặp khó khăn.',
          C: 'Sử dụng từ ngữ lai căng, tục tĩu.',
          D: 'Đối xử bình đẳng, tôn trọng đối với mọi sắc tộc, tôn giáo.'
        },
        correctAnswer: 'D',
        explanation: 'Ứng xử có văn hóa trên mạng đòi hỏi tôn trọng quyền bình đẳng, không phân biệt đối xử vì lí do sắc tộc, tôn giáo, giới tính.'
      },
      {
        id: 'de1_c22',
        type: 'single_choice',
        topicId: '12G',
        topicName: 'Giới thiệu nhóm nghề Dịch vụ và Quản trị',
        level: 'biet',
        content: 'Công việc nào sau đây là của người làm nghề Sửa chữa và bảo trì máy tính?',
        options: {
          A: 'Xác định và khắc phục lỗi phần cứng làm cho máy tính của khách hàng ngừng hoạt động.',
          B: 'Khắc phục những lỗ hổng về an toàn thông tin.',
          C: 'Quản lí, vận hành các thiết bị mạng.',
          D: 'Phân tích và xác định nhu cầu của hệ thống thông tin.'
        },
        correctAnswer: 'A',
        explanation: 'Nghề sửa chữa và bảo trì máy tính tập trung vào việc chuẩn đoán và khắc phục sự cố phần cứng, thiết bị số và phần mềm tiện ích cơ bản.'
      },
      {
        id: 'de1_c23',
        type: 'single_choice',
        topicId: '12G',
        topicName: 'Giới thiệu nhóm nghề Dịch vụ và Quản trị',
        level: 'hieu',
        content: 'Công việc nào sau đây là của người Quản trị mạng?',
        options: {
          A: 'Theo dõi, điều chỉnh các thông số cấu hình để mạng đạt được hiệu năng cao nhất.',
          B: 'Lập trình ứng dụng trên di động.',
          C: 'Thiết kế đồ họa giao diện người dùng.',
          D: 'Sửa chữa màn hình, bo mạch máy tính.'
        },
        correctAnswer: 'A',
        explanation: 'Người quản trị mạng chịu trách nhiệm thiết lập, theo dõi và tối ưu hóa các thông số mạng (băng thông, độ trễ, lưu lượng) để hệ thống vận hành liên tục.'
      },
      {
        id: 'de1_c24',
        type: 'single_choice',
        topicId: '12G',
        topicName: 'Giới thiệu nhóm nghề Dịch vụ và Quản trị',
        level: 'hieu',
        content: 'Phát biểu nào sau đây nêu đúng nguyên nhân dẫn tới sự gia tăng nhu cầu nhân lực Bảo mật hệ thống thông tin?',
        options: {
          A: 'Do máy tính ngày càng đắt đỏ.',
          B: 'Do các ngôn ngữ lập trình ngày càng khó học.',
          C: 'Do các hãng phần mềm giảm giá thành sản phẩm.',
          D: 'Do công cuộc chuyển đổi số làm gia tăng nhanh chóng khối lượng và giá trị dữ liệu người dùng, kéo theo nguy cơ về an ninh mạng tinh vi.'
        },
        correctAnswer: 'D',
        explanation: 'Dữ liệu số trở thành tài sản vô cùng giá trị, các cuộc tấn công mạng ngày càng tinh vi khiến an toàn thông tin trở thành ưu tiên sống còn của mọi tổ chức.'
      }
    ],
    part2Questions: [
      {
        id: 'de1_p2_c1',
        type: 'true_false_group',
        topicId: '12B',
        topicName: 'Mạng máy tính và Kết nối mạng',
        trackRequirement: 'ALL',
        context: 'Không chỉ có máy tính PC và máy in, nhiều thiết bị số với những chức năng khác nhau cũng được kết nối mạng. Smartphone giúp chúng ta truy cập mạng Internet mọi lúc mọi nơi. Internet of Things (IoT) trang bị cảm biến (sensor) và năng lực trí tuệ nhân tạo (AI) cho những đồ vật thông thường xung quanh chúng ta, biến chúng thành những thiết bị thông minh có khả năng kết nối với nhau qua mạng Internet để tạo thành một hệ thống thống nhất và tự động. Sau khi đọc nhận xét trên, một số bạn đã đưa ra các phát biểu sau:',
        statements: [
          {
            id: 'a',
            text: 'Mạng máy tính chỉ bao gồm các máy tính được kết nối với nhau.',
            isCorrect: false,
            explanation: 'Sai. Mạng máy tính kết nối đa dạng các thiết bị số như máy in, camera, smartphone, cảm biến IoT...'
          },
          {
            id: 'b',
            text: 'Mạng máy tính giúp các máy tính có thể trao đổi dữ liệu và dùng chung tài nguyên mạng khác, chẳng hạn như máy in.',
            isCorrect: true,
            explanation: 'Đúng. Đây là mục đích và lợi ích cốt lõi của mạng máy tính.'
          },
          {
            id: 'c',
            text: 'Giống như máy tính PC, Smartphone cũng có thể kết nối Internet qua mạng không dây.',
            isCorrect: true,
            explanation: 'Đúng. Smartphone kết nối qua Wi-Fi hoặc dữ liệu di động 4G/5G.'
          },
          {
            id: 'd',
            text: 'IoT là hệ thống bao gồm các đồ vật được trang bị sensor và năng lực tự hoạt động, có thể được kết nối với nhau qua mạng hoặc không.',
            isCorrect: false,
            explanation: 'Sai. Định nghĩa cốt lõi của IoT là các thiết bị bắt buộc phải được kết nối mạng (Internet of Things) để trao đổi dữ liệu.'
          }
        ]
      },
      {
        id: 'de1_p2_c2',
        type: 'true_false_group',
        topicId: '11F',
        topicName: 'Giới thiệu các hệ Cơ sở Dữ liệu',
        trackRequirement: 'ALL',
        context: 'Để quản lí nhân sự cho một công ty, người ta xây dựng một phần mềm với cơ sở dữ liệu quan hệ gồm 3 bảng có cấu trúc như sau:\n• CANBO (MaCB, Ten, NgaySinh, Luong, MaPH)\n• PHONG (MaPH, TenPH, DiaChi)\n• TRINHDOVANHOA (MaCB, TrinhDoHV, TrinhDoNN)\nTrong đó, bảng CANBO lưu thông tin cán bộ, bảng PHONG lưu thông tin phòng ban, bảng TRINHDOVANHOA lưu trình độ học vấn, ngoại ngữ. Sau khi tìm hiểu dữ liệu của phần mềm, các bạn học sinh đưa ra các nhận xét sau:',
        statements: [
          {
            id: 'a',
            text: 'Trong mô hình quan hệ, về mặt cấu trúc thì dữ liệu được thể hiện trong các hàng.',
            isCorrect: false,
            explanation: 'Sai. Trong mô hình quan hệ, dữ liệu được tổ chức dưới dạng các bảng (Tables).'
          },
          {
            id: 'b',
            text: 'MaPH là khoá chính của bảng CANBO.',
            isCorrect: false,
            explanation: 'Sai. Khóa chính của bảng CANBO là MaCB; MaPH chỉ là khóa ngoại tham chiếu đến bảng PHONG.'
          },
          {
            id: 'c',
            text: 'Khi một cán bộ chuyển từ nơi khác đến, cần thực hiện thao tác thêm dữ liệu vào bảng CANBO và TRINHDOVANHOA.',
            isCorrect: true,
            explanation: 'Đúng. Cán bộ mới cần lưu hồ sơ nhân sự (CANBO) và thông tin trình độ (TRINHDOVANHOA).'
          },
          {
            id: 'd',
            text: 'Để biết tên phòng và địa chỉ phòng của một cán bộ cần sử dụng bảng CANBO và TRINHDOVANHOA.',
            isCorrect: false,
            explanation: 'Sai. Bảng TRINHDOVANHOA không chứa thông tin phòng ban; muốn biết tên phòng và địa chỉ cần kết nối bảng CANBO với bảng PHONG thông qua MaPH.'
          }
        ]
      },
      {
        id: 'de1_p2_c3_cs',
        type: 'true_false_group',
        topicId: '12F_CS',
        topicName: 'Giới thiệu Học máy và Khoa học Dữ liệu',
        trackRequirement: 'CS',
        context: 'Để xây dựng các bộ lọc thư rác dựa trên học máy, cần thu thập số lượng email đủ lớn đã được gán nhãn và chia tập email này thành hai tập: tập thứ nhất cho huấn luyện mô hình, tập thứ hai để kiểm thử mô hình. Hai tiêu chí sau để đánh giá mức độ sai số của một ứng dụng lọc email:\nTC1 = Số email rác trong hòm thư thường / Tổng số email trong hòm thư thường\nTC2 = Số email thường trong hòm thư rác / Tổng số email trong hòm thư rác\nSau khi đọc nhận xét trên, một số bạn đã đưa ra các phát biểu dưới đây:',
        statements: [
          {
            id: 'a',
            text: 'Sử dụng chính tiêu đề của email để gán nhãn cho email đó.',
            isCorrect: false,
            explanation: 'Sai. Tiêu đề email chỉ là đặc trưng đầu vào, nhãn của bài toán là trạng thái {Rác, Thường}.'
          },
          {
            id: 'b',
            text: 'Các thông tin như các từ khoá trong email và tiêu đề, mức độ uy tín của địa chỉ người gửi là các đặc trưng quan trọng trong việc lọc email rác.',
            isCorrect: true,
            explanation: 'Đúng. Đây là các thuộc tính (features) đặc trưng quyết định độ chính xác của bộ phân loại.'
          },
          {
            id: 'c',
            text: 'Trước khi đưa ứng dụng lọc thư rác vào sử dụng chính thức, ứng dụng đó cần được đánh giá trên tập dữ liệu kiểm thử.',
            isCorrect: true,
            explanation: 'Đúng. Đánh giá trên tập kiểm thử độc lập là bước bắt buộc để đo lường khả năng tổng quát hóa.'
          },
          {
            id: 'd',
            text: 'Một ứng dụng lọc email rác được đánh giá là tốt khi cả TC1 và TC2 đều thấp.',
            isCorrect: true,
            explanation: 'Đúng. Tỉ lệ sót thư rác (TC1) và tỉ lệ chặn nhầm thư thường (TC2) càng thấp thì ứng dụng càng tin cậy.'
          }
        ]
      },
      {
        id: 'de1_p2_c4_cs',
        type: 'true_false_group',
        topicId: '11F_CS',
        topicName: 'Kĩ thuật lập trình & Thuật toán',
        trackRequirement: 'CS',
        context: 'Cho hàm Python sau:\ndef Ham(A, K):\n    n = len(A)\n    for i in range(n):\n        if A[i] == K:\n            return i\n    return -1\nMột số học sinh đưa ra các nhận xét về hàm trên như sau:',
        statements: [
          {
            id: 'a',
            text: 'Hàm trả lại vị trí của tất cả các phần tử có giá trị bằng K nằm trong mảng A.',
            isCorrect: false,
            explanation: 'Sai. Hàm lập tức return chỉ số i ngay khi gặp phần tử đầu tiên bằng K.'
          },
          {
            id: 'b',
            text: 'Hàm thể hiện ý tưởng của thuật toán tìm kiếm tuần tự.',
            isCorrect: true,
            explanation: 'Đúng. Thuật toán duyệt tuần tự từ đầu đến cuối mảng để so sánh A[i] == K.'
          },
          {
            id: 'c',
            text: 'Với giá trị trong mảng A = [3, 5, 7, 9], giá trị K = 7, hàm trả lại giá trị 3.',
            isCorrect: false,
            explanation: 'Sai. Phần tử 7 nằm ở chỉ số thứ 2 (chỉ số mảng Python tính từ 0: A[0]=3, A[1]=5, A[2]=7).'
          },
          {
            id: 'd',
            text: 'Độ phức tạp thời gian tính của hàm trên là T(n) = O(n).',
            isCorrect: true,
            explanation: 'Đúng. Vòng lặp chạy tối đa n lần nên độ phức tạp là O(n).'
          }
        ]
      },
      {
        id: 'de1_p2_c5_ict',
        type: 'true_false_group',
        topicId: '12E_ICT',
        topicName: 'Thực hành phần mềm tạo trang web',
        trackRequirement: 'ICT',
        context: 'Một giáo viên muốn tạo trang web cung cấp tài liệu cho học sinh tự học môn Tin học. Trang web sẽ bao gồm ba trang chính là Giới thiệu, Tài liệu và Liên hệ. Giáo viên cần tạo phần đầu trang cho tất cả các trang của website có thanh điều hướng (Menu), trong đó mỗi mục liên kết tới một trang web trong website. Với tình huống trên, một số bạn đã đưa ra các phát biểu dưới đây:',
        statements: [
          {
            id: 'a',
            text: 'Website sẽ bao gồm 3 tệp tin có phần mở rộng là .html.',
            isCorrect: true,
            explanation: 'Đúng. Ba trang web độc lập tương ứng với 3 tệp HTML.'
          },
          {
            id: 'b',
            text: 'Thanh điều hướng có 3 mục có tên Giới thiệu, Tài liệu và Liên hệ.',
            isCorrect: true,
            explanation: 'Đúng. Thanh điều hướng chứa liên kết tới đúng 3 trang của website.'
          },
          {
            id: 'c',
            text: 'Thanh điều hướng luôn cố định ở góc trên bên phải của phần đầu trang.',
            isCorrect: false,
            explanation: 'Sai. Vị trí thanh điều hướng có thể đặt ngang giữa, bên trái hoặc thanh bên tùy bố cục thiết kế.'
          },
          {
            id: 'd',
            text: 'Khi thay đổi tên trang Liên hệ thành Thông tin, mục Liên hệ trên thanh điều hướng cũng đổi tên thành Thông tin.',
            isCorrect: true,
            explanation: 'Đúng. Trong phần mềm tạo web, thanh menu tự động liên kết và đồng bộ tên với trang tương ứng.'
          }
        ]
      },
      {
        id: 'de1_p2_c6_ict',
        type: 'true_false_group',
        topicId: '11E_ICT',
        topicName: 'Thực hành tạo và khai thác CSDL với SQL',
        trackRequirement: 'ICT',
        context: 'Cho một cơ sở dữ liệu có tên thuvien dùng để quản lí việc mượn – trả sách của một trường THPT gồm 3 bảng sau:\n• bandoc (idBandoc, hoten, ngaysinh, lop, namhoc)\n• sach (idSach, tensach, namxb, sotrang)\n• giaodich (idBandoc, idSach, ngaymuon, ngaytra)\nTrong đó, bảng bandoc lưu thông tin bạn đọc, bảng sach lưu thông tin sách, bảng giaodich lưu thông tin mượn trả sách. Một số bạn học sinh đưa ra các ý kiến sau:',
        statements: [
          {
            id: 'a',
            text: 'Một bạn đọc (chưa có thông tin trong CSDL) đến thư viện mượn sách "Tin học 12" (đã có trong CSDL). Nên nhập thông tin của bạn đọc đó vào bảng bandoc trước, sau đó mới nhập thông tin giao dịch mượn sách vào bảng giaodich.',
            isCorrect: true,
            explanation: 'Đúng. Phải có bản ghi trong bảng bandoc trước để thỏa mãn ràng buộc khóa ngoại trong bảng giaodich.'
          },
          {
            id: 'b',
            text: 'Để trích xuất ra danh sách tên các cuốn sách mà bạn đọc có idBandoc bằng 4 chưa trả cho thư viện, ta cần truy xuất dữ liệu từ cả 3 bảng trên.',
            isCorrect: false,
            explanation: 'Sai. Chỉ cần kết nối 2 bảng: giaodich và sach (không cần bảng bandoc vì idBandoc đã có trong bảng giaodich).'
          },
          {
            id: 'c',
            text: 'Khoá chính của bảng giaodich là idBandoc.',
            isCorrect: false,
            explanation: 'Sai. Khóa chính phải là bộ kết hợp (idBandoc, idSach, ngaymuon) vì một bạn đọc có thể mượn nhiều sách vào nhiều ngày khác nhau.'
          },
          {
            id: 'd',
            text: 'Nhà trường yêu cầu bổ sung thông tin về tình trạng cuốn sách trước và sau khi cho mượn thì các thông tin này lưu vào bảng giaodich và bảng sach.',
            isCorrect: true,
            explanation: 'Đúng. Lưu vào giaodich để đối chiếu tình trạng từng lượt mượn và cập nhật tình trạng hiện tại vào bảng sach.'
          }
        ]
      }
    ]
  },
  {
    id: 'de_so_2',
    title: 'Đề số 2 — Đề luyện tập tổng hợp Tin học THPT 2018',
    source: 'Sách Hướng dẫn Ôn thi Tốt nghiệp THPT — NXB Đại học Sư phạm Hà Nội',
    durationMinutes: 50,
    year: 2025,
    difficulty: 'Thi thử tốt nghiệp',
    description: 'Đề số 2 trong bộ sách chính khóa. Bám sát ma trận 24 câu D1 và 4 câu D2 theo hướng dẫn Bộ GD&ĐT.',
    totalScore: 10,
    baseXP: 100,
    part1Questions: [
      {
        id: 'de2_c1',
        type: 'single_choice',
        topicId: '12A',
        topicName: 'Giới thiệu Trí tuệ Nhân tạo',
        level: 'biet',
        content: 'Hoạt động nào sau đây có sự tác động của AI?',
        options: {
          A: 'Cập nhật thông tin sản phẩm định kỳ.',
          B: 'Sắp xếp các sản phẩm theo mức giá.',
          C: 'Dự đoán nhu cầu tiêu dùng sản phẩm dựa vào phân tích dữ liệu mua sắm quá khứ.',
          D: 'Quản lí ngân sách chuỗi các cửa hàng.'
        },
        correctAnswer: 'C',
        explanation: 'Dự đoán xu hướng và nhu cầu mua sắm dựa vào học máy phân tích dữ liệu lịch sử là ứng dụng nổi bật của AI trong bán lẻ.'
      },
      {
        id: 'de2_c2',
        type: 'single_choice',
        topicId: '12A',
        topicName: 'Giới thiệu Trí tuệ Nhân tạo',
        level: 'biet',
        content: 'Loại máy móc nào sau đây không có tính thông minh?',
        options: {
          A: 'Máy chụp X-quang thông thường trong bệnh viện.',
          B: 'Máy phân loại trái cây theo chất lượng.',
          C: 'Máy điểm danh bằng hình ảnh khuôn mặt.',
          D: 'Hệ thống phát hiện đối tượng lạ xâm nhập.'
        },
        correctAnswer: 'A',
        explanation: 'Máy chụp X-quang thông thường chỉ là thiết bị quang học vật lý phát tia X thu nhận ảnh thô, không tự động phân tích hay học hỏi.'
      },
      {
        id: 'de2_c3',
        type: 'single_choice',
        topicId: '12A',
        topicName: 'Giới thiệu Trí tuệ Nhân tạo',
        level: 'hieu',
        content: 'Phần mềm chỉ đường giao thông (như Google Maps) có tính thông minh nhất khi:',
        options: {
          A: 'Đề xuất được các tuyến đường có thể đi, tự động lưu tuyến đường người dùng chọn.',
          B: 'Đo đạc khoảng cách giữa hai vị trí.',
          C: 'Hiển thị bản đồ tĩnh.',
          D: 'Đề xuất tuyến đường tối ưu theo tình trạng ùn tắc giao thông thời gian thực và tự động điều chỉnh khi có sự cố.'
        },
        correctAnswer: 'D',
        explanation: 'Khả năng cảm nhận môi trường thực tế (dữ liệu tắc đường theo thời gian thực) và giải quyết vấn đề tối ưu hóa là đặc trưng thông minh cao nhất.'
      },
      {
        id: 'de2_c4',
        type: 'single_choice',
        topicId: '12A',
        topicName: 'Giới thiệu Trí tuệ Nhân tạo',
        level: 'van_dung',
        content: 'Hành vi nào sau đây không được khuyến khích khi sử dụng AI trong học lập trình?',
        options: {
          A: 'Viết một đoạn lệnh xử lí bài toán con bằng AI dựa trên gợi ý của em.',
          B: 'Tìm ra các đoạn mã lỗi làm sai lệch kết quả mong muốn bằng cách hỏi AI.',
          C: 'Yêu cầu AI viết hoàn chỉnh toàn bộ chương trình bài toán rồi nộp mà không hiểu mã nguồn.',
          D: 'Sử dụng AI để giải thích một chương trình được cung cấp bởi giáo viên.'
        },
        correctAnswer: 'C',
        explanation: 'Lạm dụng AI làm hộ toàn bộ bài tập mà không hiểu bản chất thuật toán là vi phạm tính liêm chính học thuật và làm cùn mòn tư duy.'
      },
      {
        id: 'de2_c5',
        type: 'single_choice',
        topicId: '12B',
        topicName: 'Mạng máy tính và Kết nối mạng',
        level: 'biet',
        content: 'LAN là mạng máy tính hoạt động trong phạm vi nào sau đây?',
        options: {
          A: 'Một cơ quan lớn toàn quốc.',
          B: 'Một quốc gia.',
          C: 'Một tỉnh.',
          D: 'Phạm vi nhỏ, ví dụ như một toà nhà, một cơ quan nhỏ hay nhà riêng.'
        },
        correctAnswer: 'D',
        explanation: 'Mạng LAN (Local Area Network) là mạng kết nối máy tính trong phạm vi hẹp như hộ gia đình, văn phòng, phòng học.'
      },
      {
        id: 'de2_c6',
        type: 'single_choice',
        topicId: '12B',
        topicName: 'Mạng máy tính và Kết nối mạng',
        level: 'hieu',
        content: 'Mô tả nào dưới đây về thiết bị Access Point là đúng?',
        options: {
          A: 'Access Point là thiết bị kết nối trung tâm của mạng có dây.',
          B: 'Access Point là thiết bị mà mạng LAN bắt buộc phải có.',
          C: 'Access Point có chức năng tương tự như Switch nhưng được trang bị thêm khả năng truyền không dây Wi-Fi.',
          D: 'Access Point tự động tạo ra mạng Internet mà không cần kết nối với Router.'
        },
        correctAnswer: 'C',
        explanation: 'Access Point (Điểm truy cập không dây) kết nối vào mạng LAN có dây và phát sóng Wi-Fi cho các thiết bị di động truy cập.'
      },
      {
        id: 'de2_c7',
        type: 'single_choice',
        topicId: '12B',
        topicName: 'Mạng máy tính và Kết nối mạng',
        level: 'hieu',
        content: 'Phát biểu nào sau đây mô tả đúng về mạng Wi-Fi?',
        options: {
          A: 'Mạng Wi-Fi hoàn toàn không sử dụng bất kỳ dây cáp mạng nào trong toàn bộ hạ tầng.',
          B: 'Các thiết bị của người dùng được kết nối với mạng Wi-Fi thông qua sóng điện từ.',
          C: 'Sóng điện từ có thể truyền đi rất xa, cho phép Wi-Fi phủ sóng hàng trăm km.',
          D: 'Mạng WLAN là một loại mạng WAN sử dụng công nghệ không dây.'
        },
        correctAnswer: 'B',
        explanation: 'Mạng Wi-Fi truyền tín hiệu giữa thiết bị đầu cuối và Access Point bằng sóng điện từ (sóng vô tuyến).'
      },
      {
        id: 'de2_c8',
        type: 'single_choice',
        topicId: '12B',
        topicName: 'Mạng máy tính và Kết nối mạng',
        level: 'van_dung',
        content: 'Trong sơ đồ mạng: Internet -> Thiết bị 1 -> Thiết bị 2 -> Thiết bị 3 -> Thiết bị X phát sóng Wi-Fi tới Laptop và Smartphone. Tên của thiết bị X là gì?',
        options: {
          A: 'Router.',
          B: 'Modem.',
          C: 'Switch.',
          D: 'Access Point.'
        },
        correctAnswer: 'D',
        explanation: 'Thiết bị phát sóng không dây trực tiếp tới Laptop và Smartphone là Access Point (Điểm truy cập không dây).'
      },
      {
        id: 'de2_c9',
        type: 'single_choice',
        topicId: '12F',
        topicName: 'Tạo trang web với HTML và CSS',
        level: 'biet',
        content: 'Thuộc tính nào sau đây xác định URL mà siêu liên kết (tạo bởi thẻ <a>) sẽ chuyển đến khi được nhấn chuột?',
        options: {
          A: 'url',
          B: 'href',
          C: 'link',
          D: 'src'
        },
        correctAnswer: 'B',
        explanation: 'Thuộc tính href (hypertext reference) trong thẻ <a> quy định địa chỉ liên kết.'
      },
      {
        id: 'de2_c10',
        type: 'single_choice',
        topicId: '12F',
        topicName: 'Tạo trang web với HTML và CSS',
        level: 'biet',
        content: 'Thuộc tính nào sau đây chỉ định văn bản thay thế cho hình ảnh nếu hình ảnh không thể hiển thị?',
        options: {
          A: 'title',
          B: 'src',
          C: 'alt',
          D: 'longdesc'
        },
        correctAnswer: 'C',
        explanation: 'Thuộc tính alt (alternative text) cung cấp nội dung mô tả thay thế khi hình ảnh bị lỗi tải.'
      },
      {
        id: 'de2_c11',
        type: 'single_choice',
        topicId: '12F',
        topicName: 'Tạo trang web với HTML và CSS',
        level: 'biet',
        content: 'Thuộc tính CSS nào sau đây được sử dụng để đặt màu nền cho một phần tử?',
        options: {
          A: 'background-color',
          B: 'color-background',
          C: 'background-style',
          D: 'bgcolor'
        },
        correctAnswer: 'A',
        explanation: 'Thuộc tính CSS chuẩn để thiết lập màu nền là background-color (hoặc viết gọn là background).'
      },
      {
        id: 'de2_c12',
        type: 'single_choice',
        topicId: '12F',
        topicName: 'Tạo trang web với HTML và CSS',
        level: 'hieu',
        content: 'Đoạn mã HTML sau có lỗi: <a link="https://www.example.com">Trang chủ</a>. Nguyên nhân lỗi là gì?',
        options: {
          A: 'Sử dụng sai tên thuộc tính cho URL (dùng link thay vì href).',
          B: 'Thừa thẻ đóng </a>.',
          C: 'URL không đúng định dạng.',
          D: 'Thiếu nội dung văn bản liên kết.'
        },
        correctAnswer: 'A',
        explanation: 'Thẻ <a> dùng thuộc tính href, không có thuộc tính nào tên là link.'
      },
      {
        id: 'de2_c13',
        type: 'single_choice',
        topicId: '12F',
        topicName: 'Tạo trang web với HTML và CSS',
        level: 'hieu',
        content: 'Cho đoạn mã HTML tạo siêu liên kết: <a href="#">Trang chủ</a>. Nhận xét nào sau đây là đúng?',
        options: {
          A: 'URL không đúng.',
          B: 'Đúng cú pháp, không có lỗi (khi nhấp chuột sẽ cuộn lên đầu trang hiện tại).',
          C: 'Thiếu giá trị cho thuộc tính href.',
          D: 'Trình duyệt báo lỗi cú pháp.'
        },
        correctAnswer: 'B',
        explanation: 'href="#" là cú pháp hợp lệ dùng để tạo liên kết giữ chỗ hoặc neo lên đầu trang.'
      },
      {
        id: 'de2_c14',
        type: 'single_choice',
        topicId: '12F',
        topicName: 'Tạo trang web với HTML và CSS',
        level: 'biet',
        content: 'Khi muốn chèn một bài hát được lưu ở file baihat.mp3 vào trang web, thẻ HTML nào cần được sử dụng?',
        options: {
          A: '<video>',
          B: '<audio>',
          C: '<img>',
          D: '<mp3>'
        },
        correctAnswer: 'B',
        explanation: 'Tệp âm thanh mp3 được chèn bằng thẻ <audio src="baihat.mp3" controls></audio>.'
      },
      {
        id: 'de2_c15',
        type: 'single_choice',
        topicId: '12F',
        topicName: 'Tạo trang web với HTML và CSS',
        level: 'van_dung',
        content: 'Để tạo một bảng gồm 4 hàng và mỗi hàng có 4 ô dữ liệu (tổng 16 ô), phương án nào sau đây nêu đúng số lượng thẻ cần dùng?',
        options: {
          A: '1 thẻ <table>, 4 thẻ <tr> và 16 thẻ <td>.',
          B: '1 thẻ <table>, 3 thẻ <tr> và 12 thẻ <td>.',
          C: '4 thẻ <tr> và 9 thẻ <td>.',
          D: '3 thẻ <tr> và 19 thẻ <td>.'
        },
        correctAnswer: 'A',
        explanation: 'Cần 1 thẻ <table> bao quanh, 4 thẻ <tr> cho 4 hàng, và mỗi hàng có 4 thẻ <td> => 4 * 4 = 16 thẻ <td>.'
      },
      {
        id: 'de2_c16',
        type: 'single_choice',
        topicId: '12F',
        topicName: 'Tạo trang web với HTML và CSS',
        level: 'hieu',
        content: 'Cho bộ chọn CSS: .highlight { color: blue; font-weight: bold; font-size: 16px; }. Phạm vi áp dụng của bộ chọn này là gì?',
        options: {
          A: 'Tất cả các phần tử trong trang web.',
          B: 'Tất cả các phần tử có thuộc tính class="highlight".',
          C: 'Tất cả các phần tử có id="highlight".',
          D: 'Chỉ các thẻ có tên là highlight.'
        },
        correctAnswer: 'B',
        explanation: 'Dấu chấm trước tên (.highlight) biểu thị bộ chọn lớp (Class Selector), áp dụng cho mọi phần tử có class="highlight".'
      },
      {
        id: 'de2_c17',
        type: 'single_choice',
        topicId: '12F',
        topicName: 'Tạo trang web với HTML và CSS',
        level: 'hieu',
        content: 'Tại trang chủ một website, cần tạo một siêu liên kết đến trang liên hệ lienhe.html nằm cùng thư mục. Lựa chọn nào phù hợp nhất?',
        options: {
          A: '<a href="lienhe.html">Liên hệ</a>',
          B: '<a href="ABC/lienhe.html">Liên hệ</a>',
          C: '<a href="http://ABC/lienhe.html">Liên hệ</a>',
          D: '<a href="../ABC/lienhe.html">Liên hệ</a>'
        },
        correctAnswer: 'A',
        explanation: 'Vì hai tệp nằm trong cùng một thư mục nên dùng đường dẫn tương đối đơn giản: href="lienhe.html".'
      },
      {
        id: 'de2_c18',
        type: 'single_choice',
        topicId: '12F',
        topicName: 'Tạo trang web với HTML và CSS',
        level: 'van_dung',
        content: 'Cần chèn video halong.mp4 có độ rộng 640px, cao 360px và có bộ điều khiển. Phương án nào đúng?',
        options: {
          A: '<video src="halong.mp4" width="640" height="360" controls></video>',
          B: '<video source="halong.mp4" width="640" height="360" controls></video>',
          C: '<video link="halong.mp4" width="640" height="360"></video>',
          D: '<video url="halong.mp4" width="640" height="360"></video>'
        },
        correctAnswer: 'A',
        explanation: 'Cú pháp chuẩn: <video src="halong.mp4" width="640" height="360" controls></video>.'
      },
      {
        id: 'de2_c19',
        type: 'single_choice',
        topicId: '12D',
        topicName: 'Giữ gìn tính nhân văn trong thế giới ảo',
        level: 'hieu',
        content: 'Đặc điểm nào của giao tiếp không gian mạng mở rộng khả năng tham gia đối với người khuyết tật về ngoại hình hoặc khiếm thính/ngôn?',
        options: {
          A: 'Cho phép lượng lớn người tham gia cùng một lúc.',
          B: 'Cho phép người khiếm khuyết giao tiếp qua văn bản, ứng dụng hỗ trợ mà không cần trực diện.',
          C: 'Cho phép kết nối nhiều người có chung sở thích.',
          D: 'Cung cấp nhiều công cụ giải trí phong phú.'
        },
        correctAnswer: 'B',
        explanation: 'Môi trường số với giao tiếp chữ viết, bộ đọc màn hình hoặc chuyển văn bản thành giọng nói giúp người yếu thế tự tin hòa nhập bình đẳng.'
      },
      {
        id: 'de2_c20',
        type: 'single_choice',
        topicId: '12D',
        topicName: 'Giữ gìn tính nhân văn trong thế giới ảo',
        level: 'hieu',
        content: 'Trường hợp kẻ xấu mạo danh tài khoản để lừa người thân vay tiền online xảy ra do nạn nhân gặp rủi ro gì?',
        options: {
          A: 'Bị lộ hoặc mất quyền kiểm soát thông tin tài khoản cá nhân trong không gian mạng.',
          B: 'Người đó dùng chung mật khẩu cho nhiều trang web.',
          C: 'Người đó đăng nhiều ảnh của người khác.',
          D: 'Người đó dùng Internet quá nhiều giờ trong ngày.'
        },
        correctAnswer: 'A',
        explanation: 'Kẻ xấu lợi dụng tài khoản bị đánh cắp thông tin đăng nhập hoặc giả mạo danh tính để thực hiện hành vi lừa đảo.'
      },
      {
        id: 'de2_c21',
        type: 'single_choice',
        topicId: '12D',
        topicName: 'Giữ gìn tính nhân văn trong thế giới ảo',
        level: 'hieu',
        content: 'Khi học trực tuyến, nếu mạng Internet chập chờn dẫn đến giao tiếp bị trì hoãn, ngắt quãng. Điều này phản ánh hạn chế nào của giao tiếp mạng?',
        options: {
          A: 'Thiếu an toàn bảo mật.',
          B: 'Phụ thuộc vào phương tiện kĩ thuật và chất lượng đường truyền kết nối mạng.',
          C: 'Giảm khả năng tư duy logic.',
          D: 'Gây nghiện Internet.'
        },
        correctAnswer: 'B',
        explanation: 'Giao tiếp mạng phụ thuộc trực tiếp vào đường truyền viễn thông và thiết bị kĩ thuật số.'
      },
      {
        id: 'de2_c22',
        type: 'single_choice',
        topicId: '12G',
        topicName: 'Giới thiệu nhóm nghề Dịch vụ và Quản trị',
        level: 'biet',
        content: 'Công việc nào sau đây không thuộc trách nhiệm của người làm nghề Sửa chữa và bảo trì máy tính?',
        options: {
          A: 'Tư vấn cho khách hàng mua hay nâng cấp phần cứng, phần mềm máy tính.',
          B: 'Lắp đặt thiết bị, thực hiện các thao tác để kết nối mạng.',
          C: 'Khắc phục các lỗi làm cho máy tính bị trục trặc hay ngừng hoạt động.',
          D: 'Thiết lập chính sách và thực hiện các thao tác để tối ưu hoá hệ thống máy chủ mạng diện rộng.'
        },
        correctAnswer: 'D',
        explanation: 'Thiết lập chính sách an ninh và tối ưu hóa hệ thống máy chủ là nhiệm vụ của Quản trị hệ thống/mạng, không phải bảo trì máy tính cá nhân.'
      },
      {
        id: 'de2_c23',
        type: 'single_choice',
        topicId: '12G',
        topicName: 'Giới thiệu nhóm nghề Dịch vụ và Quản trị',
        level: 'hieu',
        content: 'Nghề Sửa chữa và bảo trì máy tính không yêu cầu bắt buộc phải có khả năng nào dưới đây?',
        options: {
          A: 'Phân tích tình huống và giải quyết vấn đề kỹ thuật phần cứng.',
          B: 'Tìm đọc tài liệu hướng dẫn trên mạng.',
          C: 'Sử dụng thành thạo tiếng Anh để hướng dẫn người dùng là người nước ngoài.',
          D: 'Xác định và thay thế linh kiện máy tính bị hỏng.'
        },
        correctAnswer: 'C',
        explanation: 'Thành thạo tiếng Anh giao tiếp quốc tế chuyên sâu là ưu thế nhưng không phải là điều kiện bắt buộc tối thiểu của thợ kỹ thuật máy tính thông thường.'
      },
      {
        id: 'de2_c24',
        type: 'single_choice',
        topicId: '12G',
        topicName: 'Giới thiệu nhóm nghề Dịch vụ và Quản trị',
        level: 'biet',
        content: 'Một phần mềm ứng dụng trên máy tính không khởi động được và báo lỗi. Trách nhiệm khắc phục thuộc về người làm nghề nào?',
        options: {
          A: 'Quản trị mạng.',
          B: 'Sửa chữa và bảo trì máy tính.',
          C: 'Quản trị hệ thống.',
          D: 'Bảo mật hệ thống thông tin.'
        },
        correctAnswer: 'B',
        explanation: 'Kỹ thuật viên sửa chữa bảo trì máy tính hỗ trợ người dùng xử lý các sự cố phần mềm ứng dụng và hệ điều hành máy trạm.'
      }
    ],
    part2Questions: [
      {
        id: 'de2_p2_c1',
        type: 'true_false_group',
        topicId: '12B',
        topicName: 'Mạng máy tính và Kết nối mạng',
        trackRequirement: 'ALL',
        context: 'Thông thường mạng có vài chục hoặc vài trăm máy trạm, hoạt động trong phạm vi một toà nhà, một cơ quan thì được gọi là mạng LAN (Mạng cục bộ). MAN là loại mạng có số lượng máy trạm và phạm vi hoạt động lớn hơn so với LAN (trong một đô thị). Ở thời kì đầu mạng LAN chỉ sử dụng cáp mạng, hiện nay công nghệ truyền không dây của mạng Wi-Fi giúp các máy trạm trao đổi dữ liệu thuận tiện và dễ dàng hơn. Sau khi đọc nhận xét trên, một số bạn đưa ra ý kiến như sau:',
        statements: [
          {
            id: 'a',
            text: 'MAN là loại mạng có số lượng máy trạm nhỏ hơn so với mạng LAN.',
            isCorrect: false,
            explanation: 'Sai. Mạng đô thị MAN (Metropolitan Area Network) có phạm vi và quy mô máy trạm lớn hơn LAN.'
          },
          {
            id: 'b',
            text: 'Mạng LAN còn được gọi là Mạng cục bộ hay Mạng nội bộ.',
            isCorrect: true,
            explanation: 'Đúng. LAN = Local Area Network.'
          },
          {
            id: 'c',
            text: 'Mạng Wi-Fi ra đời sau, khi chưa có Wi-Fi các máy trạm phải dùng dây cáp mạng để kết nối với nhau.',
            isCorrect: true,
            explanation: 'Đúng. Mạng LAN truyền thống ban đầu hoàn toàn kết nối bằng dây cáp có dây.'
          },
          {
            id: 'd',
            text: 'Một trường THPT có khoảng 50 máy PC kết nối mạng với nhau để học sinh thực hành và giáo viên truy cập Internet. Mạng nội bộ của trường đó thuộc loại mạng MAN.',
            isCorrect: false,
            explanation: 'Sai. Phạm vi một trường học là mạng cục bộ LAN, không phải mạng đô thị MAN.'
          }
        ]
      },
      {
        id: 'de2_p2_c2',
        type: 'true_false_group',
        topicId: '11F',
        topicName: 'Giới thiệu các hệ Cơ sở Dữ liệu',
        trackRequirement: 'ALL',
        context: 'Để hỗ trợ việc quản lí hàng hoá tại một cửa hàng, người ta xây dựng một phần mềm với cơ sở dữ liệu quan hệ gồm 4 bảng có cấu trúc như sau:\n• KHACHHANG (MaKH, Ten, DT)\n• VATTU (MaVT, TenVT, DVT, GiaMua, SLTon)\n• HOADON (MaHD, Ngay, MaKH, TongTG)\n• CHITIETHOADON (STT, MaHD, MaVT, SL, GiaBan)\nTrong đó bảng KHACHHANG lưu khách hàng, VATTU lưu mặt hàng, HOADON lưu hóa đơn bán hàng, CHITIETHOADON lưu chi tiết các mặt hàng của từng hóa đơn. Các bạn học sinh đưa ra nhận xét:',
        statements: [
          {
            id: 'a',
            text: 'Có thể chọn nhiều khoá chính cho bảng CHITIETHOADON.',
            isCorrect: false,
            explanation: 'Sai. Mỗi bảng trong CSDL quan hệ chỉ có DUY NHẤT một khóa chính (dù khóa chính đó có thể gồm nhiều thuộc tính kết hợp).'
          },
          {
            id: 'b',
            text: 'Hai bảng KHACHHANG và HOADON có quan hệ với nhau qua trường MaKH.',
            isCorrect: true,
            explanation: 'Đúng. MaKH là khóa ngoại của bảng HOADON tham chiếu đến khóa chính MaKH của bảng KHACHHANG.'
          },
          {
            id: 'c',
            text: 'Do sơ ý nên nhân viên đã nhập thiếu số lượng và tổng trị giá cho một hoá đơn, do vậy cần thực hiện thao tác thêm dữ liệu vào trong bảng HOADON và CHITIETHOADON.',
            isCorrect: false,
            explanation: 'Sai. Dữ liệu đã có sẵn chỉ bị thiếu thông tin thì cần thực hiện thao tác SỬA (UPDATE), không phải thao tác THÊM (INSERT).'
          },
          {
            id: 'd',
            text: 'Để thống kê các hoá đơn được bán trong ngày "20/05/2024" người ta phải sử dụng hai bảng HOADON và CHITIETHOADON.',
            isCorrect: false,
            explanation: 'Sai. Trường Ngay đã nằm sẵn trong bảng HOADON nên chỉ cần truy xuất duy nhất bảng HOADON.'
          }
        ]
      },
      {
        id: 'de2_p2_c3_cs',
        type: 'true_false_group',
        topicId: '12F_CS',
        topicName: 'Giới thiệu Học máy và Khoa học Dữ liệu',
        trackRequirement: 'CS',
        context: 'Một ứng dụng học máy dự đoán giá nhà khu vực Hà Nội được huấn luyện trên một bảng dữ liệu của 1000 căn nhà đã được mua bán trong thời gian gần đây. Mỗi dòng của bảng ứng với một căn nhà và gồm các đặc trưng: địa chỉ, diện tích, khoảng cách tới trung tâm, giá giao dịch. Một số bạn học sinh đưa ra các phát biểu sau:',
        statements: [
          {
            id: 'a',
            text: 'Phương pháp (thuật toán) học máy là học có giám sát.',
            isCorrect: true,
            explanation: 'Đúng. Vì dữ liệu đã có sẵn nhãn y là giá giao dịch thực tế của 1000 căn nhà.'
          },
          {
            id: 'b',
            text: 'Nhãn của dữ liệu là địa chỉ căn nhà.',
            isCorrect: false,
            explanation: 'Sai. Nhãn (target) của bài toán dự đoán giá nhà là giá giao dịch, địa chỉ chỉ là thuộc tính đặc trưng đầu vào.'
          },
          {
            id: 'c',
            text: 'Có thể sử dụng dữ liệu của 1000 căn nhà trên vừa để huấn luyện và vừa để kiểm thử ứng dụng dự đoán giá nhà.',
            isCorrect: false,
            explanation: 'Sai. Tập dữ liệu kiểm thử bắt buộc phải độc lập với tập huấn luyện để tránh hiện tượng quá khớp (overfitting).'
          },
          {
            id: 'd',
            text: 'Ứng dụng học máy trên có thể áp dụng dự đoán giá nhà ở TP Hồ Chí Minh mà không cần thay đổi bất cứ dòng lệnh nào, chỉ cần thay đổi bảng dữ liệu huấn luyện và dữ liệu kiểm thử.',
            isCorrect: true,
            explanation: 'Đúng. Thuật toán học máy có khả năng khái quát hóa từ dữ liệu mới mà không cần lập trình lại mã nguồn.'
          }
        ]
      },
      {
        id: 'de2_p2_c4_cs',
        type: 'true_false_group',
        topicId: '11F_CS',
        topicName: 'Kĩ thuật lập trình & Thuật toán',
        trackRequirement: 'CS',
        context: 'Cho đoạn mã giả sau:\n1  i = 0\n2  while (i < n):\n3      if A[i] == x:\n4          return i\n5      i = i + 1\n6  return "Không tìm thấy"\nMột số bạn học sinh đưa ra các nhận xét sau:',
        statements: [
          {
            id: 'a',
            text: 'Thuật toán duyệt lần lượt các phần tử của dãy để tìm phần tử có giá trị bằng K.',
            isCorrect: true,
            explanation: 'Đúng. Đây là thuật toán tìm kiếm tuần tự (Linear Search).'
          },
          {
            id: 'b',
            text: 'Có thể sử dụng danh sách liên kết để lưu trữ các phần tử trong dãy A.',
            isCorrect: true,
            explanation: 'Đúng. Danh sách liên kết đơn có thể duyệt tuần tự từng nút từ head đến tail.'
          },
          {
            id: 'c',
            text: 'Với bộ dữ liệu A = [2, 5, 7, 9, 13, 21, 25], K = 13, thuật toán trả lại kết quả là 13.',
            isCorrect: false,
            explanation: 'Sai. Thuật toán trả về CHỈ SỐ i (ở đây là chỉ số 4), chứ không trả về giá trị 13.'
          },
          {
            id: 'd',
            text: 'Với bộ dữ liệu A = [2, 5, 7, 9, 13, 21, 25], K = 15, thuật toán trả lại kết quả không tìm thấy sau 7 bước lặp. Ta có thể cải tiến để thuật toán kết thúc sau 5 bước lặp.',
            isCorrect: true,
            explanation: 'Đúng. Vì dãy đã tăng dần, khi duyệt tới A[4] = 13 < 15 nhưng A[5] = 21 > 15 thì có thể kết luận ngay không tìm thấy mà không cần duyệt tiếp.'
          }
        ]
      },
      {
        id: 'de2_p2_c5_ict',
        type: 'true_false_group',
        topicId: '12E_ICT',
        topicName: 'Thực hành phần mềm tạo trang web',
        trackRequirement: 'ICT',
        context: 'Một bạn sử dụng phần mềm tạo trang web để tạo website giới thiệu về các địa điểm du lịch nổi tiếng của địa phương gồm 3 trang: Trang chủ, Danh lam thắng cảnh và Liên hệ. Bạn muốn tạo phần đầu trang có biểu ngữ, logo và thanh điều hướng để liên kết các trang web trong website với nhau. Bạn có một vài nhận xét như sau:',
        statements: [
          {
            id: 'a',
            text: 'Có thể tự thiết kế phần đầu trang hoặc sử dụng các theme (mẫu) có sẵn.',
            isCorrect: true,
            explanation: 'Đúng. Các công cụ tạo web đều cung cấp theme mẫu hoặc cho phép tùy chỉnh tự do.'
          },
          {
            id: 'b',
            text: 'Tất cả các trang web trong một website thường có thanh điều hướng giống nhau.',
            isCorrect: true,
            explanation: 'Đúng. Thanh điều hướng đồng nhất giúp người dùng dễ dàng chuyển đổi qua lại giữa các trang.'
          },
          {
            id: 'c',
            text: 'Logo hoặc biểu ngữ của trang web được thêm vào bằng cách chèn thêm hình ảnh (Image) từ máy tính hoặc từ Internet thông qua URL.',
            isCorrect: true,
            explanation: 'Đúng. Có thể tải ảnh lên từ máy hoặc liên kết URL ảnh ngoài.'
          },
          {
            id: 'd',
            text: 'Không thể tạo các mục con (submenu) trong các mục của thanh điều hướng.',
            isCorrect: false,
            explanation: 'Sai. Hầu hết các phần mềm tạo web đều hỗ trợ tạo menu đa cấp (submenu thả xuống).'
          }
        ]
      },
      {
        id: 'de2_p2_c6_ict',
        type: 'true_false_group',
        topicId: '11E_ICT',
        topicName: 'Thực hành tạo và khai thác CSDL với SQL',
        trackRequirement: 'ICT',
        context: 'Một cơ sở dữ liệu quản lí nhân sự của một công ty gồm các bảng có cấu trúc như sau:\n• Bảng nhanvien (idNhanvien, hoten, ngaysinh, diachi, soDT, idPhong)\n• Bảng phong (idPhong, tenphong, diachiPhong)\nTrong đó idNhanvien, idPhong đều là kiểu số nguyên (int), tự động tăng lên 1 khi có bản ghi mới. Một số bạn học sinh đưa ra các ý kiến về việc khai thác cơ sở dữ liệu trên:',
        statements: [
          {
            id: 'a',
            text: 'Khi bổ sung một nhân viên mới vào phòng "Phòng Kinh doanh" đã có trong cơ sở dữ liệu với idPhong là 3 thì bộ dữ liệu phù hợp để nhập vào bảng nhanvien là ("Nguyễn Văn Bình", "19/9/1998", "108 Cầu Giấy - Hà Nội", "0123456789", "Phòng Kinh doanh").',
            isCorrect: false,
            explanation: 'Sai. Cột idPhong có kiểu số nguyên int, giá trị hợp lệ đưa vào phải là số 3, không phải chuỗi "Phòng Kinh doanh".'
          },
          {
            id: 'b',
            text: 'Khi muốn đổi tên "Phòng Kế hoạch Tài chính" thành "Phòng Kế hoạch", chỉ cần cập nhật một dòng của bảng phong mà không cần thay đổi dữ liệu bảng nhanvien.',
            isCorrect: true,
            explanation: 'Đúng. Do bảng nhanvien chỉ lưu mã phòng idPhong chứ không lưu tên phòng, đây là ưu điểm tránh dư thừa dữ liệu.'
          },
          {
            id: 'c',
            text: 'Khi xoá một nhân viên trong bảng nhanvien thì cần xoá phòng tương ứng của nhân viên đó trong bảng phong.',
            isCorrect: false,
            explanation: 'Sai. Xóa nhân viên không làm mất đi phòng ban của công ty.'
          },
          {
            id: 'd',
            text: 'Nếu cho phép một nhân viên có thể thuộc nhiều hơn một phòng thì cơ sở dữ liệu với 2 bảng trên không đáp ứng được.',
            isCorrect: true,
            explanation: 'Đúng. Mối quan hệ nhiều - nhiều giữa nhân viên và phòng ban đòi hỏi phải tạo thêm một bảng trung gian mới.'
          }
        ]
      }
    ]
  }
];

export const DIAGNOSTIC_QUESTIONS: SingleChoiceQuestion[] = [
  {
    id: 'diag_1',
    type: 'single_choice',
    topicId: '12A',
    topicName: 'Giới thiệu Trí tuệ Nhân tạo',
    level: 'biet',
    content: 'Hội thảo khoa học nào được coi là điểm mốc lịch sử chính thức khai sinh thuật ngữ Trí tuệ nhân tạo (AI)?',
    options: {
      A: 'Hội thảo Hampshire năm 1950.',
      B: 'Hội thảo Dartmouth năm 1956.',
      C: 'Hội thảo Bletchley Park năm 1945.',
      D: 'Hội thảo Stanford năm 1965.'
    },
    correctAnswer: 'B',
    explanation: 'Hội thảo khoa học tại trường Đại học Dartmouth (Mỹ) năm 1956 là mốc ra đời chính thức của thuật ngữ AI.'
  },
  {
    id: 'diag_2',
    type: 'single_choice',
    topicId: '12A',
    topicName: 'Giới thiệu Trí tuệ Nhân tạo',
    level: 'hieu',
    content: 'Đặc trưng nào của AI thể hiện khả năng trích rút tri thức, quy luật từ dữ liệu để thực hiện công việc tốt hơn sau mỗi lần?',
    options: {
      A: 'Khả năng học.',
      B: 'Khả năng nhận thức.',
      C: 'Khả năng suy luận.',
      D: 'Khả năng giao tiếp.'
    },
    correctAnswer: 'A',
    explanation: 'Khả năng học (Learning) là cốt lõi của AI, giúp máy tính khái quát hóa và hoàn thiện hành vi từ dữ liệu.'
  },
  {
    id: 'diag_3',
    type: 'single_choice',
    topicId: '12B',
    topicName: 'Mạng máy tính và Kết nối mạng',
    level: 'biet',
    content: 'Thiết bị nào trong mạng LAN có nhiệm vụ đọc địa chỉ MAC của gói tin và chuyển tiếp chính xác đến cổng của máy nhận?',
    options: {
      A: 'Hub.',
      B: 'Modem.',
      C: 'Switch (Bộ chuyển mạch).',
      D: 'Repeater.'
    },
    correctAnswer: 'C',
    explanation: 'Switch xây dựng bảng địa chỉ MAC và tạo kênh truyền trực tiếp giữa cổng gửi và cổng nhận.'
  },
  {
    id: 'diag_4',
    type: 'single_choice',
    topicId: '12B',
    topicName: 'Mạng máy tính và Kết nối mạng',
    level: 'hieu',
    content: 'Địa chỉ IPv4 có độ dài bao nhiêu bit và được chia thành bao nhiêu octet?',
    options: {
      A: '16 bit, 2 octet.',
      B: '32 bit, 4 octet.',
      C: '64 bit, 8 octet.',
      D: '128 bit, 16 octet.'
    },
    correctAnswer: 'B',
    explanation: 'Địa chỉ IPv4 gồm 32 bit, chia làm 4 cụm mỗi cụm 8 bit gọi là octet (ví dụ 192.168.1.1).'
  },
  {
    id: 'diag_5',
    type: 'single_choice',
    topicId: '12B',
    topicName: 'Mạng máy tính và Kết nối mạng',
    level: 'van_dung',
    content: 'Xác định địa chỉ IP thập phân tương ứng với chuỗi nhị phân 8 bit đầu tiên là: 11000000',
    options: {
      A: '128',
      B: '168',
      C: '192',
      D: '255'
    },
    correctAnswer: 'C',
    explanation: '1*128 + 1*64 + 0*32 + ... = 192.'
  },
  {
    id: 'diag_6',
    type: 'single_choice',
    topicId: '12F',
    topicName: 'Tạo trang web với HTML và CSS',
    level: 'biet',
    content: 'Cặp thẻ nào sau đây quy định phần thân chính chứa toàn bộ nội dung hiển thị của trang web?',
    options: {
      A: '<head> và </head>',
      B: '<title> và </title>',
      C: '<body> và </body>',
      D: '<main> và </main>'
    },
    correctAnswer: 'C',
    explanation: '<body> chứa toàn bộ văn bản, hình ảnh, video và cấu trúc hiển thị trên trình duyệt.'
  },
  {
    id: 'diag_7',
    type: 'single_choice',
    topicId: '12F',
    topicName: 'Tạo trang web với HTML và CSS',
    level: 'hieu',
    content: 'Trong CSS Box Model, thuộc tính nào quy định khoảng cách từ đường viền của phần tử ra ngoài tới các phần tử lân cận?',
    options: {
      A: 'padding',
      B: 'border',
      C: 'margin',
      D: 'outline'
    },
    correctAnswer: 'C',
    explanation: 'margin là khoảng cách lề bên ngoài; padding là khoảng đệm bên trong đường viền.'
  },
  {
    id: 'diag_8',
    type: 'single_choice',
    topicId: '12F',
    topicName: 'Tạo trang web với HTML và CSS',
    level: 'van_dung',
    content: 'Muốn nhúng một video từ YouTube vào trang web HTML, thẻ nào sau đây được sử dụng?',
    options: {
      A: '<video>',
      B: '<embed>',
      C: '<iframe>',
      D: '<youtube>'
    },
    correctAnswer: 'C',
    explanation: 'Khung nội tuyến <iframe> được thiết kế chuyên dụng để nhúng tài nguyên ngoại tuyến như YouTube hoặc Google Maps.'
  },
  {
    id: 'diag_9',
    type: 'single_choice',
    topicId: '11F',
    topicName: 'Giới thiệu các hệ Cơ sở Dữ liệu',
    level: 'biet',
    content: 'Trong mô hình cơ sở dữ liệu quan hệ, mỗi hàng trong bảng được gọi là gì?',
    options: {
      A: 'Thuộc tính (Field).',
      B: 'Bản ghi (Record).',
      C: 'Kiểu dữ liệu (Data type).',
      D: 'Khóa ngoại (Foreign key).'
    },
    correctAnswer: 'B',
    explanation: 'Mỗi hàng là một bản ghi (record) thể hiện thông tin của một đối tượng cụ thể.'
  },
  {
    id: 'diag_10',
    type: 'single_choice',
    topicId: '11F_CS',
    topicName: 'Kĩ thuật lập trình & Thuật toán',
    level: 'hieu',
    content: 'Đặc điểm tiên quyết bắt buộc để áp dụng được thuật toán Tìm kiếm nhị phân (Binary Search) là gì?',
    options: {
      A: 'Mảng phải chứa ít hơn 100 phần tử.',
      B: 'Mảng chỉ chứa các số nguyên dương.',
      C: 'Dãy số trong mảng bắt buộc đã được sắp xếp theo thứ tự.',
      D: 'Mảng phải được lưu trữ trong danh sách liên kết kép.'
    },
    correctAnswer: 'C',
    explanation: 'Tìm kiếm nhị phân chỉ hoạt động khi mảng đã được sắp xếp tăng hoặc giảm dần.'
  }
];

export const DAILY_CHALLENGE_POOL: SingleChoiceQuestion[] = [
  ...OFFICIAL_EXAMS[0].part1Questions.slice(0, 10)
];
