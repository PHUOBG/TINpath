export interface NewsSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  numberedSteps?: { title: string; content: string }[];
  note?: string;
}

export interface NewsArticle {
  id: string;
  category: string;
  badge: string;
  title: string;
  shortDescription: string;
  sections: NewsSection[];
  sourceUrl: string;
  sourceLabel: string;
}

export const OFFICIAL_NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'pho-diem-tin-hoc-thpt-2026',
    category: 'Thi tốt nghiệp THPT',
    badge: 'Phổ điểm · Tốt nghiệp THPT 2026',
    title: 'Phổ điểm môn Tin học kỳ thi tốt nghiệp THPT năm 2026',
    shortDescription:
      'Bộ Giáo dục và Đào tạo đã công bố phổ điểm môn Tin học trong kỳ thi tốt nghiệp THPT năm 2026. Đây là nguồn thông tin tham khảo giúp học sinh nhìn nhận kết quả bài thi và cân nhắc định hướng tuyển sinh.',
    sections: [
      {
        heading: 'Phổ điểm môn Tin học năm 2026',
        paragraphs: [
          'Phổ điểm môn Tin học kỳ thi tốt nghiệp THPT năm 2026 được Bộ Giáo dục và Đào tạo công bố vào ngày 1/7/2026. Dữ liệu phổ điểm cung cấp thông tin về kết quả làm bài của thí sinh, phục vụ việc đánh giá kết quả kỳ thi và tham khảo trong công tác tuyển sinh.',
        ],
      },
      {
        heading: 'Phổ điểm có ý nghĩa gì với học sinh?',
        paragraphs: [
          'Phổ điểm cho thấy sự phân bố kết quả của thí sinh, giúp người học có thêm góc nhìn về mặt bằng điểm thi. Khi tham khảo phổ điểm, học sinh cần chú ý đến phân bố điểm và so sánh với yêu cầu tuyển sinh của ngành, trường mà mình quan tâm.',
          'Tuy nhiên, phổ điểm không thể tự nó xác định điểm chuẩn của từng trường hoặc bảo đảm khả năng trúng tuyển của một thí sinh. Điểm chuẩn còn phụ thuộc vào phương thức xét tuyển, tổ hợp môn, chỉ tiêu và các điều kiện tuyển sinh áp dụng trong năm đó.',
        ],
      },
      {
        heading: 'Học sinh nên làm gì?',
        bullets: [
          'Xem phổ điểm từ nguồn công bố chính thức.',
          'Đối chiếu kết quả của bản thân với yêu cầu tuyển sinh được công bố bởi trường đại học.',
          'Đọc kỹ đề án tuyển sinh và điều kiện xét tuyển của từng ngành.',
          'Không sử dụng phổ điểm của một môn để kết luận chắc chắn về khả năng trúng tuyển.',
        ],
      },
    ],
    sourceUrl:
      'https://xaydungchinhsach.chinhphu.vn/pho-diem-mon-tin-hoc-ky-thi-tot-nghiep-nam-2026-119260701094014188.htm',
    sourceLabel: 'Nguồn tham khảo chính thức',
  },
  {
    id: 'cau-truc-de-thi-tin-hoc-thpt-2026',
    category: 'Ôn thi tốt nghiệp THPT',
    badge: 'Cấu trúc đề thi · Ôn thi THPT',
    title:
      'Cấu trúc đề thi tốt nghiệp THPT môn Tin học năm 2026: Những điều học sinh cần biết',
    shortDescription:
      'Tìm hiểu định dạng bài thi Tin học, cách phân chia dạng câu hỏi và những lưu ý khi xây dựng kế hoạch ôn tập theo chương trình giáo dục phổ thông.',
    sections: [
      {
        heading: 'Cấu trúc và định dạng đề thi',
        paragraphs: [
          'Đề thi tốt nghiệp THPT môn Tin học năm 2026 được xây dựng theo định hướng của Chương trình giáo dục phổ thông 2018 và cấu trúc định dạng đề thi do Bộ Giáo dục và Đào tạo ban hành.',
          'Theo tài liệu hướng dẫn cấu trúc định dạng đề thi được viện dẫn trong nguồn tham khảo, bài thi Tin học có thời gian làm bài 50 phút và sử dụng hình thức trắc nghiệm. Học sinh cần nắm rõ dạng câu hỏi, yêu cầu kiến thức và cách tính điểm được áp dụng chính thức.',
        ],
      },
      {
        heading: 'Chuẩn bị ôn tập như thế nào?',
        numberedSteps: [
          {
            title: '1. Hệ thống hóa kiến thức',
            content:
              'Ôn tập theo chủ đề trong chương trình học, xác định phần kiến thức còn chưa vững và luyện tập có kế hoạch.',
          },
          {
            title: '2. Rèn kỹ năng đọc câu hỏi',
            content:
              'Đọc kỹ yêu cầu, phân biệt dữ kiện với kết luận và kiểm tra từng phương án trước khi lựa chọn đáp án.',
          },
          {
            title: '3. Luyện tập có đánh giá',
            content:
              'Sau mỗi bài luyện tập, xem lại câu trả lời sai, xác định nguyên nhân và luyện thêm các câu hỏi cùng chủ đề.',
          },
          {
            title: '4. Làm quen với thời gian thi',
            content:
              'Luyện đề trong điều kiện thời gian phù hợp để rèn khả năng phân bổ thời gian và hạn chế bỏ sót câu hỏi.',
          },
        ],
      },
      {
        heading: 'Lưu ý về thông tin cấu trúc đề',
        note: 'Trước khi xuất bản, hãy đối chiếu số lượng câu hỏi, số phần và cách tính điểm với văn bản chính thức của Bộ Giáo dục và Đào tạo. Không tự điền số liệu nếu nguồn được cung cấp có thông tin không nhất quán.',
      },
    ],
    sourceUrl:
      'https://thuvienphapluat.vn/hoi-dap-phap-luat/cau-truc-de-thi-tot-nghiep-thpt-mon-tin-hoc-nam-2026-chi-tiet-nhu-the-nao-138085500.html',
    sourceLabel: 'Nguồn tham khảo',
  },
];
