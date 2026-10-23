import { SubjectTopicId } from '../types';

export interface LessonOutlineItem {
  id: string;
  title: string;
  level: 1 | 2;
}

export interface PracticeQuizQuestion {
  id: string;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface TopicLesson {
  id: SubjectTopicId;
  code: string;
  title: string;
  grade: '10' | '11' | '12';
  track?: 'ALL' | 'CS' | 'ICT';
  examWeight: string;
  iconName: string;
  summary: string;

  // New detailed curriculum sections matching user layout
  outline: LessonOutlineItem[];
  objectives: string[];
  standards: { level: string; desc: string }[];
  warmUp: { context: string; question: string };
  mainSections: {
    id: string;
    number: string;
    title: string;
    content: string;
    subSections?: {
      id: string;
      letter: string;
      title: string;
      content: string;
      example?: string;
      codeSnippet?: string;
    }[];
    table?: { headers: string[]; rows: string[][] };
    codeSnippet?: string;
  }[];
  memoryNotes: string[];
  practiceQuestions: PracticeQuizQuestion[];
  application: {
    realLife: string;
    examTraps: string[];
    tips: string[];
  };

  // Backwards compatibility fields
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
  "12A": {
    "id": "12A",
    "code": "Chủ đề 12A",
    "title": "Giới thiệu Trí tuệ Nhân tạo (AI)",
    "grade": "12",
    "track": "ALL",
    "examWeight": "Trọng tâm Lớp 12 (~15% lệnh hỏi)",
    "iconName": "sparkles",
    "summary": "Tìm hiểu lịch sử ra đời, 5 đặc trưng cơ bản (Học, Suy luận, Nhận thức, Hiểu ngôn ngữ, Giải quyết vấn đề), phân loại AI hẹp (ANI) và AI rộng (AGI), bài kiểm tra Turing, các lĩnh vực nghiên cứu, ứng dụng trong đời sống và cảnh báo về đạo đức, an ninh mạng.",
    "outline": [
      {
        "id": "muc-tieu",
        "title": "Mục tiêu bài học",
        "level": 1
      },
      {
        "id": "muc-do",
        "title": "Mức độ kiến thức và kĩ năng cần đạt",
        "level": 1
      },
      {
        "id": "khoi-dong",
        "title": "Hoạt động khởi động",
        "level": 1
      },
      {
        "id": "sec-1",
        "title": "1. Giới thiệu về trí tuệ nhân tạo (AI - Artificial Intelligence)",
        "level": 1
      },
      {
        "id": "sec-1-1",
        "title": "a) Khái niệm trí tuệ nhân tạo và lịch sử hình thành",
        "level": 2
      },
      {
        "id": "sec-1-2",
        "title": "b) Các đặc trưng của trí tuệ nhân tạo",
        "level": 2
      },
      {
        "id": "sec-1-3",
        "title": "c) Phân loại AI: AI hẹp (ANI) và AI rộng (AGI)",
        "level": 2
      },
      {
        "id": "sec-1-4",
        "title": "d) Một số lĩnh vực nghiên cứu phát triển AI trọng tâm",
        "level": 2
      },
      {
        "id": "sec-2",
        "title": "2. Trí tuệ nhân tạo trong khoa học và đời sống",
        "level": 1
      },
      {
        "id": "sec-2-1",
        "title": "a) Một số lĩnh vực phát triển nhờ ứng dụng của AI",
        "level": 2
      },
      {
        "id": "sec-2-2",
        "title": "b) Ảnh hưởng của AI đến con người và cảnh báo xã hội",
        "level": 2
      },
      {
        "id": "ghi-nho",
        "title": "Ghi nhớ",
        "level": 1
      },
      {
        "id": "luyen-tap",
        "title": "Luyện tập (Trắc nghiệm chuẩn sách)",
        "level": 1
      },
      {
        "id": "van-dung",
        "title": "Vận dụng",
        "level": 1
      }
    ],
    "objectives": [
      "Giải thích được sơ lược về khái niệm Trí tuệ nhân tạo (AI - Artificial Intelligence) và mốc lịch sử hình thành (1955 - 1956).",
      "Nêu được ví dụ minh hoạ cho một số ứng dụng điển hình của AI: điều khiển tự động, chẩn đoán bệnh tật, nhận dạng chữ viết/tiếng nói/khuôn mặt, trợ lí ảo.",
      "Chỉ ra được 5 đặc trưng nhận biết AI: Khả năng học, Khả năng suy luận, Khả năng nhận thức, Khả năng hiểu ngôn ngữ, Khả năng giải quyết vấn đề.",
      "Phân biệt được AI hẹp (ANI) và AI rộng (AGI); nắm được ý nghĩa của bài kiểm tra Turing (Turing Test).",
      "Phân tích được những cảnh báo về sự phát triển của AI trong tương lai: đạo đức, an ninh mạng (Deepfake), quyền riêng tư và việc làm."
    ],
    "standards": [
      {
        "level": "Nhận biết",
        "desc": "Nêu được khái niệm sơ lược về AI; mốc lịch sử năm 1955 do John McCarthy đề xuất và hội thảo Dartmouth 1956; chỉ ra được các ứng dụng AI thông dụng (trợ lý ảo, nhận diện khuôn mặt)."
      },
      {
        "level": "Thông hiểu",
        "desc": "Phân tích được 5 đặc trưng của AI qua ví dụ thực tế (hệ chuyên gia MYCIN suy luận luật, xe tự lái nhận thức cảm biến); giải thích sự khác biệt giữa AI hẹp (ANI) và AI rộng (AGI); hiểu cơ chế bài kiểm tra Turing."
      },
      {
        "level": "Vận dụng",
        "desc": "Đánh giá được tác động của AI trong thực tiễn (giáo dục cá nhân hoá, y tế, an ninh mạng); nhận diện hành vi lừa đảo qua Deepfake và đề xuất biện pháp bảo vệ dữ liệu cá nhân."
      }
    ],
    "warmUp": {
      "context": "Hằng ngày, khi bạn mở khoá điện thoại bằng Face ID, hỏi Siri về thời tiết hoặc dịch nhanh một đoạn văn bản bằng Google Translate, máy tính đang thực hiện những công việc mà trước đây chỉ con người mới làm được.",
      "question": "Theo em, máy tính làm thế nào để hiểu được giọng nói và nhận diện được khuôn mặt của chúng ta? Liệu máy tính có thực sự có 'suy nghĩ' và 'cảm xúc' như con người hay không?"
    },
    "mainSections": [
      {
        "id": "sec-1",
        "number": "1.",
        "title": "Giới thiệu về trí tuệ nhân tạo (AI - Artificial Intelligence)",
        "content": "Năm 1955, Giáo sư John McCarthy (Đại học Dartmouth, Mỹ) lần đầu tiên đưa ra định nghĩa về ngành Trí tuệ nhân tạo là 'khoa học và kĩ thuật chế tạo máy móc thông minh'. Một năm sau, năm 1956, Hội thảo khoa học tại Đại học Dartmouth quy tụ nhiều nhà khoa học máy tính hàng đầu thế giới được xem là sự kiện lịch sử chính thức khai sinh ngành Trí tuệ nhân tạo.\\nNgày nay, AI đã phát triển vượt bậc và trở thành một ngành khoa học mũi nhọn, định hình tương lai của nhân loại.",
        "subSections": [
          {
            "id": "sec-1-1",
            "letter": "a)",
            "title": "Khái niệm trí tuệ nhân tạo và bản chất",
            "content": "• Bản chất công việc trí tuệ: Là công việc thực hiện đòi hỏi trí tuệ đặc trưng của con người như khả năng suy luận, khái quát hoá, hiểu ngôn ngữ và ra quyết định.\\n• Máy tính thông thường: Xử lí khối lượng dữ liệu khổng lồ cực kì nhanh và chính xác trong thời gian ngắn, nhưng không có khả năng tự suy luận hay thích ứng nếu không được lập trình cụ thể.\\n• Ngành Trí tuệ nhân tạo: Ra đời nhằm nghiên cứu và phát triển trí tuệ của máy tính, làm cho máy tính có các năng lực trí tuệ tương tự như con người.\\n• Định nghĩa thông dụng: Trí tuệ nhân tạo là khả năng của máy tính có thể làm những công việc mang tính trí tuệ con người, như khả năng học, khả năng suy luận, khả năng hiểu ngôn ngữ tự nhiên và khả năng giải quyết vấn đề phức tạp."
          },
          {
            "id": "sec-1-2",
            "letter": "b)",
            "title": "Các đặc trưng của trí tuệ nhân tạo",
            "content": "Theo sách Hướng dẫn ôn thi tốt nghiệp môn Tin học (Bộ GD&ĐT), trí tuệ nhân tạo được nhận biết qua các đặc trưng cốt lõi sau:\\n1. Khả năng học: Khái quát hoá, trích rút ra các tri thức (mô hình, quy luật, mẫu) từ dữ liệu lớn đã có và sử dụng tri thức đó để đưa ra quyết định hợp lí. Ví dụ: phần mềm nhận dạng chữ viết tay, hệ thống dịch tự động đa ngôn ngữ, hệ thống nhận diện khuôn mặt người tham gia giao thông.\\n2. Khả năng suy luận: Vận dụng các quy tắc suy luận logic và cơ sở tri thức có từ trước để rút ra kết luận mới hoặc quyết định. Ví dụ kinh điển: Phần mềm hệ chuyên gia y tế MYCIN đưa vào cơ sở tri thức các luật dạng 'NẾU có các triệu chứng A1, A2... THÌ bệnh nhân mắc bệnh B', sau đó hỗ trợ bác sĩ chẩn đoán bệnh nhiễm trùng máu chính xác.\\n3. Khả năng nhận thức: Cảm nhận (thu nhận, phân tích) và hiểu biết (xử lí) về môi trường xung quanh thông qua các cảm biến (sensor) hoặc thiết bị thu nhận tín hiệu đầu vào. Ví dụ: Hệ thống xe ô tô tự lái nhận biết biển báo, người đi bộ, chướng ngại vật thông qua camera và cảm biến LiDAR gắn trên thân xe.\\n4. Khả năng hiểu ngôn ngữ: Giao tiếp trực tiếp với con người bằng ngôn ngữ tự nhiên, bao gồm đọc, hiểu ý đồ và diễn giải bằng cả văn bản lẫn tiếng nói. Ví dụ: Tra cứu thông tin trên Internet thông qua tương tác với trợ lí ảo Siri, Google Assistant, Alexa.\\n5. Khả năng giải quyết vấn đề: Phối hợp linh hoạt các khả năng trên để giải quyết những tình huống phức tạp hoặc tối ưu theo mục tiêu đặt ra. Ví dụ: Thuật toán tự động sắp xếp thời khoá biểu cho trường học dựa trên các ràng buộc phòng học và giáo viên."
          },
          {
            "id": "sec-1-3",
            "letter": "c)",
            "title": "Phân loại AI: AI hẹp (ANI) và AI rộng (AGI)",
            "content": "Dựa trên mức độ mô phỏng trí tuệ con người, AI được chia thành 2 cấp độ phân loại chính:\\n• AI hẹp (Artificial Narrow Intelligence - ANI) hay AI yếu: Được xây dựng để giải quyết các nhiệm vụ chuyên biệt nằm trong phạm vi hẹp của một lĩnh vực cụ thể. Ví dụ: Hệ thống nhận diện biển báo giao thông hoạt động rất tốt khi phát hiện biển báo, nhưng không thể nhận dạng khuôn mặt hay dịch văn bản; phần mềm chơi cờ vua Stockfish hoặc cờ vây AlphaGo có thể đánh bại đại kiện tướng thế giới nhưng không thể lái xe hay làm thơ. Tất cả các hệ thống AI hiện nay (kể cả ChatGPT, Gemini) đều thuộc nhóm AI hẹp.\\n• AI rộng (Artificial General Intelligence - AGI) hay AI mạnh: Được định hướng nhằm thực hiện các hoạt động trí tuệ tổng hợp trên nhiều lĩnh vực giống như con người. Đặc trưng nổi bật của AGI là khả năng tự học độc lập từ dữ liệu mới và hành động có ý thức không phụ thuộc hoàn toàn vào lập trình viên. Hiện nay AGI vẫn đang trong quá trình nghiên cứu lâu dài trong tương lai.\\n• Bài kiểm tra Turing (Turing Test): Do nhà toán học thiên tài Alan Turing đề xuất năm 1950. Phép thử đặt ra rằng: nếu một giám khảo con người trò chuyện qua màn hình với một đối tượng (người hoặc máy) mà không thể phân biệt được mình đang nói chuyện với người hay với máy, thì cỗ máy đó được xem là đã đạt đến Trí tuệ nhân tạo."
          },
          {
            "id": "sec-1-4",
            "letter": "d)",
            "title": "Một số lĩnh vực nghiên cứu phát triển AI",
            "content": "Trí tuệ nhân tạo là một ngành khoa học liên ngành rộng lớn, gồm 4 phân ngành nghiên cứu trọng tâm:\\n1. Học máy (Machine Learning): Nghiên cứu các thuật toán cho phép máy tính tự học hỏi và cải thiện hiệu suất từ dữ liệu mà không cần phải lập trình quy tắc tường minh.\\n2. Thị giác máy tính (Computer Vision): Nghiên cứu các phương pháp giúp máy tính thu nhận, xử lí, phân tích và hiểu được các hình ảnh kĩ thuật số cũng như video thực tế.\\n3. AI tạo sinh (Generative AI): Tạo ra các nội dung mới (văn bản, mã nguồn, hình ảnh, âm thanh, video) dựa trên các mẫu dữ liệu đã học (ví dụ: ChatGPT, Gemini, Midjourney).\\n4. Xử lí ngôn ngữ tự nhiên (Natural Language Processing - NLP): Nghiên cứu khả năng giúp máy tính hiểu, dịch thuật và phát sinh ngôn ngữ con người một cách tự nhiên."
          }
        ],
        "table": {
          "headers": [
            "Tiêu chí so sánh",
            "AI Hẹp (ANI - Artificial Narrow Intelligence)",
            "AI Rộng (AGI - Artificial General Intelligence)"
          ],
          "rows": [
            [
              "Phạm vi hoạt động",
              "Chuyên biệt trong một nhiệm vụ/lĩnh vực duy nhất",
              "Đa lĩnh vực, tổng quát trên mọi khía cạnh trí tuệ"
            ],
            [
              "Khả năng tự ý thức",
              "Hoàn toàn không có ý thức, chỉ tính toán xác suất",
              "Có tư duy độc lập, có thể thích ứng như con người"
            ],
            [
              "Ví dụ thực tiễn",
              "AlphaGo, Siri, ChatGPT, nhận diện biển báo, xe tự lái",
              "Chưa tồn tại trong thực tế (mục tiêu nghiên cứu tương lai)"
            ],
            [
              "Tiêu chuẩn đánh giá",
              "Độ chính xác trên tập dữ liệu kiểm thử (Test Set)",
              "Vượt qua bài kiểm tra Turing (Turing Test)"
            ]
          ]
        }
      },
      {
        "id": "sec-2",
        "number": "2.",
        "title": "Trí tuệ nhân tạo trong khoa học và đời sống",
        "content": "AI đang cách mạng hoá mọi lĩnh vực kinh tế - xã hội, tuy nhiên sự phát triển nhanh chóng cũng kéo theo những thách thức sâu sắc về đạo đức và an ninh.",
        "subSections": [
          {
            "id": "sec-2-1",
            "letter": "a)",
            "title": "Một số lĩnh vực phát triển nhờ ứng dụng của AI",
            "content": "• Trong giáo dục: Cá nhân hoá lộ trình học tập, tự động chấm điểm và đánh giá kết quả, phát hiện các lỗ hổng kiến thức để đề xuất ôn tập kịp thời; phần mềm giám sát thi tích hợp AI chống gian lận.\\n• Trong y tế: Chẩn đoán bệnh sớm với độ chính xác cao qua ảnh X-quang, MRI; hệ thống MYCIN hỗ trợ vi trùng máu; IBM Watson hỗ trợ phác đồ điều trị ung thư; rút ngắn thời gian thử nghiệm lâm sàng dược phẩm.\\n• Trong sản xuất và nông nghiệp: Tối ưu hoá quy trình tự động hoá, kiểm tra phân loại chất lượng nông sản bằng thị giác máy tính, dự báo chính xác chuỗi cung ứng hàng hoá.\\n• Trong giao thông: Hệ thống điều khiển đèn giao thông thông minh chống ùn tắc; xe tự hành (Tesla, Waymo)."
          },
          {
            "id": "sec-2-2",
            "letter": "b)",
            "title": "Ảnh hưởng của AI đến con người và cảnh báo xã hội",
            "content": "1. Đạo đức và tính đúng đắn: Dữ liệu huấn luyện đúng đắn và không thiên vị là điều kiện tiên quyết để AI hoạt động chuẩn mực. Nếu dữ liệu bị thiên lệch, AI có thể đưa ra các phán đoán phân biệt chủng tộc, giới tính hoặc sai lệch lịch sử.\\n2. An ninh mạng và tội phạm số: AI bị kẻ xấu lợi dụng để tạo ra công nghệ 'Deepfake' – giả mạo khuôn mặt, hình ảnh, giọng nói của người thân nạn nhân để gọi điện lừa đảo vay tiền, chiếm đoạt tài sản.\\n3. Xâm phạm quyền riêng tư: Các mô hình AI thu thập khối lượng dữ liệu cá nhân (lịch sử duyệt web, vị trí, tin nhắn) có nguy cơ bị rò rỉ hoặc bán cho bên thứ ba vì mục đích vụ lợi.\\n4. Tác động đến việc làm: Nhiều công việc hành chính, nhập liệu, dịch thuật và chăm sóc khách hàng đang dần bị thay thế bởi chatbot và tự động hoá, đòi hỏi người lao động phải không ngừng nâng cao kĩ năng số."
          }
        ]
      }
    ],
    "memoryNotes": [
      "Năm 1955 John McCarthy đưa ra định nghĩa AI; Hội thảo Dartmouth 1956 chính thức khai sinh ngành AI.",
      "5 đặc trưng nhận biết AI: Học, Suy luận, Nhận thức, Hiểu ngôn ngữ, Giải quyết vấn đề.",
      "Mọi hệ thống AI hiện nay (kể cả ChatGPT) đều là AI hẹp (ANI). AGI là mục tiêu nghiên cứu tương lai gắn với Bài kiểm tra Turing.",
      "Dữ liệu huấn luyện là điều kiện tiên quyết đảm bảo đạo đức AI; Deepfake là mối nguy lừa đảo công nghệ cao cần cảnh giác."
    ],
    "practiceQuestions": [
      {
        "id": "12a-q1",
        "question": "Câu 1. Mô tả nào sau đây nêu đúng quá trình nhận thức của máy tính?",
        "options": {
          "A": "Quá trình trích rút được tri thức từ những dữ liệu do con người cung cấp.",
          "B": "Quá trình tự động hiểu biết được môi trường xung quanh thông qua cảm biến.",
          "C": "Quá trình thu thập thông tin từ nguồn tài nguyên mạng do con người cung cấp.",
          "D": "Quá trình đọc, hiểu tri thức mới thông qua các quy tắc và tri thức sẵn có."
        },
        "correctAnswer": "A",
        "explanation": "Trích nguyên văn sách Hướng dẫn ôn thi tốt nghiệp môn Tin học (trang 172): 'Quá trình nhận thức có thể hiểu là trích rút các tri thức từ dữ liệu được thu thập thông qua hiểu biết về môi trường xung quanh và các nguồn tài nguyên sẵn có. Trong đó, đọc và hiểu tri thức là một hoạt động thành phần của quá trình này.'"
      },
      {
        "id": "12a-q2",
        "question": "Câu 2. Cụm từ thích hợp để mô tả sự thông minh của máy tính là:",
        "options": {
          "A": "Trí tuệ của máy tính.",
          "B": "Trí nhớ của máy tính.",
          "C": "Trí óc của máy tính.",
          "D": "Suy nghĩ của máy tính."
        },
        "correctAnswer": "A",
        "explanation": "Trích nguyên văn đáp án sách (trang 172): 'A. Sự thông minh của máy tính đề cập đến khả năng thực hiện công việc trí tuệ như con người, thay vì chỉ thực hiện ghi nhớ (trí nhớ) hoặc khả năng thực hiện các công việc (suy nghĩ) thông qua phần cứng và chương trình của máy tính (trí óc).'"
      },
      {
        "id": "12a-q3",
        "question": "Câu 3. Phát biểu nào sau đây nêu đúng khái niệm trí tuệ nhân tạo?",
        "options": {
          "A": "Khả năng của máy tính có thể làm những công việc mang tính trí tuệ con người.",
          "B": "Trí tuệ của máy tính có thể làm những công việc tương đương trí tuệ con người.",
          "C": "Tích hợp công nghệ hiện đại vào máy tính, giúp máy tính hiểu được con người.",
          "D": "Hoạt động máy tính giao tiếp được với con người bằng ngôn ngữ tự nhiên."
        },
        "correctAnswer": "A",
        "explanation": "Trích nguyên văn đáp án sách (trang 172): 'A. Tích hợp các công nghệ hiện đại giúp máy tính có khả năng thực hiện được các công việc mang tính trí tuệ người (hiểu, giao tiếp, phân tích, đề xuất,...) nhưng không thể tương đương với trí tuệ con người.'"
      },
      {
        "id": "12a-q4",
        "question": "Câu 4. Thiết bị nào sau đây được tích hợp trợ lí ảo?",
        "options": {
          "A": "Máy tính cầm tay.",
          "B": "Điện thoại cảm ứng.",
          "C": "Chuông báo cháy.",
          "D": "Máy quét mã vạch."
        },
        "correctAnswer": "B",
        "explanation": "Trích nguyên văn đáp án sách (trang 172): 'B. Các thiết bị điện tử hoặc thiết bị vào/ra đơn giản không được tích hợp trí tuệ nhân tạo (trợ lí ảo) vì đặc thù của thiết bị. Điện thoại thông minh/cảm ứng là thiết bị điển hình tích hợp trợ lí ảo như Siri, Google Assistant.'"
      },
      {
        "id": "12a-q5",
        "question": "Câu 5. Yếu tố nào sau đây là điều kiện tiên quyết đảm bảo AI hạn chế vi phạm đạo đức?",
        "options": {
          "A": "Môi trường triển khai.",
          "B": "Phạm vi của thông tin.",
          "C": "Dữ liệu huấn luyện.",
          "D": "Mô hình xây dựng."
        },
        "correctAnswer": "C",
        "explanation": "Trích nguyên văn đáp án sách (trang 172): 'C. Một hệ thống AI đúng đắn khi dữ liệu học phải phù hợp với tiêu chuẩn đạo đức vì đây là cơ sở tri thức của hệ thống.'"
      },
      {
        "id": "12a-q6",
        "question": "Câu 6. Thuật ngữ 'deepfake' dùng để nói về hành vi nào sau đây?",
        "options": {
          "A": "Tạo ra các hình ảnh, âm thanh,... giả mạo.",
          "B": "Phát hiện ra các hình ảnh, âm thanh,... giả mạo.",
          "C": "Tạo ra các thông tin không có thật trên mạng.",
          "D": "Phát hiện ra các thông tin giả mạo trên mạng."
        },
        "correctAnswer": "A",
        "explanation": "Trích nguyên văn đáp án sách (trang 172): 'A. Deepfake sử dụng các thuật toán học sâu để miêu tả các hành vi giả mạo âm thanh, hình ảnh và video của con người.'"
      }
    ],
    "application": {
      "realLife": "Khi nhận được cuộc gọi video từ người thân nhờ chuyển tiền gấp nhưng khẩu hình miệng hoặc giọng nói có dấu hiệu ngắt quãng bất thường, hãy bình tĩnh cúp máy và gọi trực tiếp bằng số điện thoại di động thông thường để xác minh, tránh bẫy công nghệ Deepfake.",
      "examTraps": [
        "Bẫy 1: Cho rằng ChatGPT đã là AGI (Sai, ChatGPT vẫn chỉ là AI hẹp ANI).",
        "Bẫy 2: Nhầm lẫn năm John McCarthy đặt thuật ngữ (1955) với năm diễn ra Hội thảo Dartmouth (1956).",
        "Bẫy 3: Cho rằng hệ chuyên gia MYCIN sử dụng học sâu hiện đại (Sai, MYCIN dùng cơ sở tri thức luật logic NẾU-THÌ)."
      ],
      "tips": [
        "Học thuộc 5 đặc trưng của AI: Học, Suy luận, Nhận thức, Hiểu ngôn ngữ, Giải quyết vấn đề.",
        "Luôn nhớ từ khoá 'Dữ liệu huấn luyện' là cốt lõi của tính đúng đắn và đạo đức AI."
      ]
    },
    "requirements": [
      "Giải thích sơ lược khái niệm Trí tuệ nhân tạo (AI - Artificial Intelligence).",
      "Nêu ví dụ minh hoạ cho một số ứng dụng điển hình: điều khiển tự động, chẩn đoán bệnh, nhận dạng chữ viết/tiếng nói/khuôn mặt, trợ lý ảo.",
      "Chỉ ra 5 đặc trưng nhận biết AI: Học, Suy luận, Nhận thức, Hiểu ngôn ngữ, Giải quyết vấn đề.",
      "Phân biệt được AI hẹp (ANI) và AI rộng (AGI), hiểu ý nghĩa phép thử Turing (Turing Test).",
      "Nêu được cảnh báo về đạo đức, an ninh mạng (Deepfake), quyền riêng tư và tác động việc làm."
    ],
    "keyConcepts": [
      {
        "term": "Thuật ngữ AI (1955 - 1956)",
        "definition": "Nhà khoa học John McCarthy đặt ra năm 1955. Hội thảo khoa học Dartmouth năm 1956 chính thức đánh dấu sự ra đời của ngành AI.",
        "example": "Khởi đầu từ hội thảo Dartmouth 1956 tại Mỹ."
      },
      {
        "term": "5 Đặc trưng của AI",
        "definition": "Gồm: (1) Khả năng học, (2) Khả năng suy luận, (3) Khả năng nhận thức, (4) Khả năng hiểu ngôn ngữ, (5) Khả năng giải quyết vấn đề.",
        "example": "Hệ chuyên gia MYCIN áp dụng luật IF-THEN chẩn đoán nhiễm trùng máu."
      },
      {
        "term": "AI hẹp (ANI) vs AI rộng (AGI)",
        "definition": "ANI giải quyết nhiệm vụ cụ thể trong phạm vi hẹp (AlphaGo, ChatGPT). AGI có trí tuệ tổng quát như con người và vượt qua phép thử Turing.",
        "example": "ChatGPT, xe tự lái hiện tại vẫn thuộc phạm vi AI hẹp."
      },
      {
        "term": "Deepfake & Đạo đức AI",
        "definition": "Công nghệ tạo hình ảnh, giọng nói giả mạo người thật. Dữ liệu huấn luyện đúng đắn là điều kiện tiên quyết đảm bảo đạo đức AI.",
        "example": "Giả giọng người thân vay tiền, tạo hình ảnh xuyên tạc."
      }
    ],
    "theorySections": [
      {
        "title": "1. Bản chất sự khác biệt giữa Con người và Máy tính",
        "content": "Con người có khả năng tư duy, khái quát hóa, suy luận logic và kiểm soát cảm xúc. Máy tính xử lý tính toán dữ liệu lớn cực nhanh và chính xác nhưng không có khả năng tự suy nghĩ nếu không được tích hợp AI."
      },
      {
        "title": "2. Các ứng dụng thực tế nổi bật",
        "content": "– Y tế: Hệ chuyên gia y tế MYCIN, IBM Watson.\\n– Giao thông: Xe tự lái kết hợp camera + LiDAR.\\n– Giáo dục: Cá nhân hóa lộ trình học.\\n– Trợ lý ảo: Siri, Google Assistant, Alexa."
      }
    ],
    "practicalTips": [
      "Nhớ rõ mốc thời gian: John McCarthy (1955), Hội thảo Dartmouth (1956).",
      "Hệ chuyên gia MYCIN sử dụng quy tắc logic IF-THEN.",
      "ChatGPT là AI tạo sinh và vẫn thuộc nhóm AI hẹp (ANI)."
    ],
    "commonPitfalls": [
      "Nhầm lẫn dây chuyền tự động hóa thông thường là AI.",
      "Nghĩ rằng AI hiện nay đã có cảm xúc như con người.",
      "Cho rằng ChatGPT là AGI."
    ]
  },
  "12B": {
    "id": "12B",
    "code": "Chủ đề 12B",
    "title": "Mạng máy tính và Kết nối mạng",
    "grade": "12",
    "track": "ALL",
    "examWeight": "Trọng tâm Lớp 12 (~20% lệnh hỏi)",
    "iconName": "network",
    "summary": "Nắm vững kiến trúc mạng LAN/WLAN/WAN/Internet, thiết bị mạng (Switch, Router, Access Point, Modem), cáp xoắn UTP, cáp quang, giao thức TCP/IP, địa chỉ IPv4/IPv6, hệ thống DNS và thực hành chia sẻ tệp/máy in.",
    "outline": [
      {
        "id": "muc-tieu",
        "title": "Mục tiêu bài học",
        "level": 1
      },
      {
        "id": "muc-do",
        "title": "Mức độ kiến thức và kĩ năng cần đạt",
        "level": 1
      },
      {
        "id": "khoi-dong",
        "title": "Hoạt động khởi động",
        "level": 1
      },
      {
        "id": "sec-1",
        "title": "1. Khái niệm, ích lợi của mạng máy tính",
        "level": 1
      },
      {
        "id": "sec-2",
        "title": "2. Khái niệm mạng LAN và các thiết bị mạng thông dụng",
        "level": 1
      },
      {
        "id": "sec-2-1",
        "title": "a) Khái niệm mạng LAN và các thành phần chính",
        "level": 2
      },
      {
        "id": "sec-2-2",
        "title": "b) Chức năng của Switch, Router, Modem, Access Point",
        "level": 2
      },
      {
        "id": "sec-3",
        "title": "3. Môi trường truyền dẫn: Cáp xoắn và Cáp quang",
        "level": 1
      },
      {
        "id": "sec-4",
        "title": "4. Giao thức mạng TCP/IP và Địa chỉ IP",
        "level": 1
      },
      {
        "id": "sec-4-1",
        "title": "a) Bộ giao thức TCP/IP và cơ chế hoạt động",
        "level": 2
      },
      {
        "id": "sec-4-2",
        "title": "b) Cấu trúc địa chỉ IPv4 và IPv6",
        "level": 2
      },
      {
        "id": "sec-5",
        "title": "5. Thực hành chia sẻ tài nguyên trên mạng LAN",
        "level": 1
      },
      {
        "id": "ghi-nho",
        "title": "Ghi nhớ",
        "level": 1
      },
      {
        "id": "luyen-tap",
        "title": "Luyện tập (Trắc nghiệm chuẩn sách)",
        "level": 1
      },
      {
        "id": "van-dung",
        "title": "Vận dụng",
        "level": 1
      }
    ],
    "objectives": [
      "Nêu được khái niệm, ích lợi của mạng máy tính; phân biệt mạng LAN, WLAN (Wi-Fi), WAN và Internet.",
      "Mô tả được chức năng chính của các thiết bị mạng: Switch, Router, Modem, Access Point và kết nối được với PC.",
      "Giải thích được đặc điểm, cấu tạo và ứng dụng của cáp xoắn UTP và cáp quang.",
      "Mô tả sơ lược vai trò và chức năng của bộ giao thức TCP/IP; phân biệt được địa chỉ IPv4 (32 bit) và IPv6 (128 bit).",
      "Thực hiện được các thao tác thiết lập chia sẻ thư mục (Read, Change, Full Control) và chia sẻ máy in qua mạng LAN trên hệ điều hành Windows."
    ],
    "standards": [
      {
        "level": "Nhận biết",
        "desc": "Nêu được tên gọi các thiết bị mạng; phân biệt mạng Wi-Fi là WLAN; nhớ số bit của IPv4 (32 bit = 4 byte) và IPv6 (128 bit = 16 byte)."
      },
      {
        "level": "Thông hiểu",
        "desc": "Giải thích được cơ chế hoạt động của Switch qua bảng địa chỉ MAC; vai trò định tuyến của Router; chức năng điều chế của Modem; vai trò của TCP (kiểm soát luồng) và IP (định tuyến)."
      },
      {
        "level": "Vận dụng",
        "desc": "Chuyển đổi địa chỉ IPv4 từ nhị phân sang thập phân; thiết lập quyền chia sẻ thư mục và máy in trong mạng LAN trường học; khắc phục sự cố mất kết nối mạng."
      }
    ],
    "warmUp": {
      "context": "Trong phòng máy tính của trường, tất cả các máy tính của học sinh đều có thể in ra cùng một chiếc máy in đặt ở bàn giáo viên và truy cập chung vào một thư mục bài giảng.",
      "question": "Các máy tính đã kết nối với nhau như thế nào? Thiết bị mạng nào đóng vai trò trung tâm điều phối các kết nối này?"
    },
    "mainSections": [
      {
        "id": "sec-1",
        "number": "1.",
        "title": "Khái niệm, ích lợi của mạng máy tính",
        "content": "• Khái niệm mạng máy tính: Là một hệ thống các thiết bị số được kết nối với nhau thông qua các phương tiện truyền dẫn (có dây hoặc không dây) để truyền dữ liệu và trao đổi thông tin.\\n• Lợi ích của mạng máy tính: Giúp người dùng chia sẻ tài nguyên phần cứng (máy in, máy quét, ổ cứng mạng), chia sẻ phần mềm, tài liệu học tập và giao tiếp trao đổi thông tin nhanh chóng, tiết kiệm chi phí."
      },
      {
        "id": "sec-2",
        "number": "2.",
        "title": "Khái niệm mạng LAN và các thiết bị mạng thông dụng",
        "content": "Mạng cục bộ (LAN - Local Area Network) kết nối các máy tính trong phạm vi hẹp như một toà nhà, văn phòng, trường học hoặc gia đình.",
        "subSections": [
          {
            "id": "sec-2-1",
            "letter": "a)",
            "title": "Các thành phần chính của mạng LAN",
            "content": "Một mạng LAN điển hình bao gồm: Máy chủ (Server), các máy tính cá nhân (Client PC), máy in mạng, cáp mạng, Switch, Router và Access Point."
          },
          {
            "id": "sec-2-2",
            "letter": "b)",
            "title": "Chức năng của Switch, Router, Modem, Access Point",
            "content": "1. Switch (Bộ chuyển mạch): Là thiết bị trung tâm kết nối các máy tính trong cùng mạng LAN bằng cáp mạng UTP. Switch xây dựng bảng địa chỉ MAC của từng cổng, từ đó chỉ chuyển tiếp gói tin đến đúng cổng của thiết bị nhận đích mà không gửi tràn lan sang các cổng khác.\\n2. Router (Bộ định tuyến): Thiết bị quan trọng kết nối các mạng LAN khác nhau với nhau hoặc nối LAN ra mạng diện rộng WAN/Internet. Router đọc địa chỉ IP đích để tìm tuyến đường đi tốt nhất cho gói tin.\\n3. Access Point (Điểm truy cập không dây): Tiếp nhận tín hiệu từ mạng LAN có dây và phát sóng Wi-Fi cho các thiết bị di động (laptop, điện thoại) kết nối vào mạng LAN.\\n4. Modem: Thiết bị điều chế (chuyển đổi tín hiệu số Digital từ máy tính thành tín hiệu tương tự Analog để truyền qua đường dây viễn thông) và giải điều chế (chuyển tín hiệu tương tự nhận được thành tín hiệu số)."
          }
        ]
      },
      {
        "id": "sec-3",
        "number": "3.",
        "title": "Môi trường truyền dẫn: Cáp xoắn và Cáp quang",
        "content": "• Cáp xoắn UTP (Unshielded Twisted Pair): Gồm 4 cặp dây đồng bện xoắn đôi vào nhau để khử nhiễu điện từ. Đầu cáp bấm giắc RJ-45 chuẩn chuẩn T568A hoặc T568B. Chuẩn cáp CAT 5e hỗ trợ tốc độ 1 Gbps, CAT 6 hỗ trợ lên đến 10 Gbps trong cự li 100m.\\n• Cáp quang (Fiber Optic): Cấu tạo gồm 3 lớp (lõi thủy tinh core, lớp phản quang cladding, lớp vỏ nhựa bảo vệ coating). Truyền dữ liệu bằng các xung ánh sáng dựa trên hiện tượng phản xạ toàn phần. Cáp quang có ưu điểm: tốc độ cực cao, cự li truyền xa hàng ngàn km, hoàn toàn không bị ảnh hưởng bởi nhiễu điện từ hay sấm sét."
      },
      {
        "id": "sec-4",
        "number": "4.",
        "title": "Giao thức mạng TCP/IP và Địa chỉ IP",
        "content": "Giao thức mạng là tập hợp các quy tắc chuẩn điều khiển việc truyền dữ liệu giữa các thiết bị mạng.",
        "subSections": [
          {
            "id": "sec-4-1",
            "letter": "a)",
            "title": "Bộ giao thức TCP/IP",
            "content": "• Giao thức TCP (Transmission Control Protocol): Hoạt động ở tầng Giao vận, phụ trách việc chia nhỏ thông điệp thành các gói tin (packet), đánh số thứ tự, kiểm soát luồng và kiểm tra phát hiện lỗi. Nếu có gói tin bị thất lạc, TCP yêu cầu gửi lại, đảm bảo truyền dữ liệu chính xác và tin cậy tuyệt đối.\\n• Giao thức IP (Internet Protocol): Hoạt động ở tầng Mạng, phụ trách việc gán địa chỉ IP nguồn và IP đích cho gói tin, định tuyến đường đi tốt nhất qua các Router trên toàn cầu."
          },
          {
            "id": "sec-4-2",
            "letter": "b)",
            "title": "Cấu trúc địa chỉ IPv4 và IPv6",
            "content": "• IPv4: Có độ dài 32 bit, chia thành 4 octet (mỗi octet 8 bit = 1 byte), biểu diễn bằng 4 số thập phân phân cách bởi dấu chấm (ví dụ: 192.168.1.1). IPv4 cung cấp khoảng 2^32 ≈ 4,3 tỉ địa chỉ và hiện nay đã cạn kiệt.\\n• IPv6: Có độ dài 128 bit (16 byte), gồm 8 nhóm số thập lục phân (hex) phân cách bởi dấu hai chấm (ví dụ: 2001:0db8:85a3:0000:0000:8a2e:0370:7334). Cung cấp 2^128 địa chỉ (gần như vô tận).\\n• Hệ thống tên miền (DNS): Đóng vai trò như 'danh bạ', chuyển đổi tên miền dạng chữ (ví dụ: moet.gov.vn) sang địa chỉ IP dạng số mà máy tính có thể hiểu được."
          }
        ]
      },
      {
        "id": "sec-5",
        "number": "5.",
        "title": "Thực hành chia sẻ tài nguyên trên mạng LAN",
        "content": "• Chia sẻ thư mục trên Windows:\\nBước 1: Nhấp chuột phải vào thư mục cần chia sẻ, chọn Properties -> tab Sharing -> nút Share.\\nBước 2: Chọn tài khoản người dùng hoặc nhóm 'Everyone', sau đó gán quyền truy cập: Read (chỉ đọc), Change (sửa/xoá), Full Control (toàn quyền).\\n• Chia sẻ máy in:\\nBước 1: Mở Control Panel -> Devices and Printers -> nhấp chuột phải vào máy in -> Printer properties -> tab Sharing -> chọn 'Share this printer'.\\nBước 2: Trên máy khách cần in, mở Add a printer -> chọn 'Select a shared printer by name' -> nhập đường dẫn mạng đến máy in đã chia sẻ."
      }
    ],
    "memoryNotes": [
      "Mạng Wi-Fi chính là mạng cục bộ không dây (WLAN).",
      "Switch chuyển mạch nội bộ LAN dựa vào địa chỉ MAC; Router định tuyến liên mạng dựa vào địa chỉ IP.",
      "IPv4 dài 32 bit (4 byte); IPv6 dài 128 bit (16 byte). Không được nhầm IPv6 dài 6 byte!",
      "Máy tính để bàn (Desktop PC) thông thường KHÔNG có sẵn Card mạng không dây Wi-Fi, cần trang bị thêm hoặc kết nối dây cáp UTP."
    ],
    "practiceQuestions": [
      {
        "id": "12b-q1",
        "question": "Câu 1. Phát biểu nào sau đây là tên thường gọi của mạng Wi-Fi?",
        "options": {
          "A": "Mạng WLAN.",
          "B": "Mạng Internet.",
          "C": "Mạng không dây.",
          "D": "Mạng cục bộ."
        },
        "correctAnswer": "A",
        "explanation": "Trích nguyên văn đáp án sách Hướng dẫn ôn thi tốt nghiệp môn Tin học (trang 172): 'A. Phương án C sai vì mạng Wi-Fi chỉ là một trong số nhiều loại mạng không dây (Wi-Fi, Bluetooth, 4G/5G). Mạng cục bộ không dây có tên viết tắt là WLAN (Wireless Local Area Network), chính là tên gọi kĩ thuật của mạng Wi-Fi.'"
      },
      {
        "id": "12b-q2",
        "question": "Câu 2. Phát biểu nào sau đây mô tả đúng về mạng WAN?",
        "options": {
          "A": "Tên viết tắt của Wide Area Network, nghĩa là mạng diện rộng.",
          "B": "Tên viết đầy đủ là Wireless Area Network, nghĩa là mạng diện rộng.",
          "C": "Là mạng kết nối trong phạm vi một trường học hoặc chung cư.",
          "D": "Là một dạng đặc biệt của mạng Internet."
        },
        "correctAnswer": "A",
        "explanation": "Trích nguyên văn đáp án sách (trang 173): 'A. Phương án C sai vì mạng kết nối trong phạm vi trường học hoặc chung cư là LAN. Phương án D sai vì Internet là một trường hợp riêng của mạng WAN toàn cầu.'"
      },
      {
        "id": "12b-q3",
        "question": "Câu 3. Giao thức TCP/IP là gì?",
        "options": {
          "A": "Tên ghép của hai giao thức TCP (kiểm soát truyền vận) và IP (định tuyến liên mạng).",
          "B": "Tên của một giao thức duy nhất phụ trách mọi chức năng mạng.",
          "C": "Giao thức chỉ sử dụng riêng cho mạng cục bộ LAN có dây.",
          "D": "Phần mềm ứng dụng dùng để xem trang web trên máy tính tính."
        },
        "correctAnswer": "A",
        "explanation": "Trích nguyên văn đáp án sách (trang 173): 'A. TCP/IP là tên của hai giao thức ghép lại: TCP phụ trách việc kiểm soát truyền vận không thất lạc gói tin; IP lo việc định tuyến, tìm ra tuyến đường đi tốt nhất trên mạng.'"
      },
      {
        "id": "12b-q4",
        "question": "Câu 4. Phát biểu nào sau đây đúng về địa chỉ IPv4 và IPv6?",
        "options": {
          "A": "Địa chỉ IPv4 có độ dài 32 bit (4 byte), còn độ dài của IPv6 là 128 bit (16 byte).",
          "B": "Địa chỉ IPv4 có độ dài 4 byte, còn độ dài của IPv6 là 6 byte.",
          "C": "Địa chỉ IPv4 có kho địa chỉ vô hạn và hiện chưa có dấu hiệu cạn kiệt.",
          "D": "Địa chỉ IP được cấp trực tiếp cho từng người dùng chứ không phải thiết bị."
        },
        "correctAnswer": "A",
        "explanation": "Trích nguyên văn đáp án sách (trang 173): 'A. IPv4 có độ dài 32 bit = 4 byte (khoảng 4,3 tỉ địa chỉ và đã cạn kiệt). IPv6 có độ dài 128 bit = 16 byte. Phương án B sai vì nhầm IPv6 là 6 byte.'"
      },
      {
        "id": "12b-q5",
        "question": "Câu 5. Phát biểu nào sau đây SAI khi nói về việc kết nối PC với mạng Wi-Fi thông qua các thiết bị kết nối mạng?",
        "options": {
          "A": "Cả máy tính để bàn lẫn máy tính xách tay đều có thể kết nối vào mạng Wi-Fi nếu được trang bị đầy đủ về phần cứng thiết bị.",
          "B": "Hiện nay, mọi Laptop và điện thoại thông minh thông thường đều được trang bị sẵn Card mạng (NIC) không dây để kết nối vào mạng Wi-Fi.",
          "C": "Hiện nay, các máy tính để bàn (Desktop PC) thông thường đều được trang bị sẵn Card mạng (NIC) không dây để kết nối vào mạng Wi-Fi.",
          "D": "Hiện nay, máy tính để bàn (Desktop PC) cần được lắp thêm Card mạng (NIC) không dây thì mới kết nối được vào mạng Wi-Fi."
        },
        "correctAnswer": "C",
        "explanation": "Trích nguyên văn đáp án sách (trang 173): 'C. Hiện nay, Desktop PC thông thường KHÔNG được trang bị sẵn NIC không dây mà chỉ có cổng mạng Ethernet có dây cắm giắc RJ-45.'"
      }
    ],
    "application": {
      "realLife": "Cách đổi nhị phân sang thập phân cho một octet IP: 8 bit tương ứng với các trọng số 128, 64, 32, 16, 8, 4, 2, 1. Ví dụ chuỗi nhị phân 11000000 = 128 + 64 = 192.",
      "examTraps": [
        "Bẫy phổ biến nhất: Nhầm độ dài IPv6 là 6 byte (Sai, 128 bit = 16 byte!).",
        "Bẫy 2: Nghĩ rằng máy tính để bàn luôn có Wi-Fi tích hợp sẵn.",
        "Bẫy 3: Cho rằng TCP/IP là một giao thức duy nhất."
      ],
      "tips": [
        "Thuộc lòng chức năng: Switch dùng bảng MAC nối nội bộ; Router dùng IP định tuyến liên mạng.",
        "Quyền chia sẻ thư mục: Read (chỉ đọc) < Change (sửa, ghi, xóa) < Full Control (toàn quyền)."
      ]
    },
    "requirements": [
      "Phân biệt mạng cục bộ (LAN), mạng cục bộ không dây (WLAN / Wi-Fi) và mạng diện rộng (WAN / Internet).",
      "Nêu chức năng chính của Switch, Router, Access Point, Modem.",
      "Hiểu rõ môi trường truyền dẫn: Cáp xoắn UTP và Cáp quang.",
      "Giải thích bộ giao thức TCP/IP, cấu trúc IPv4 và IPv6.",
      "Thao tác thiết lập chia sẻ dữ liệu và chia sẻ máy in qua mạng LAN."
    ],
    "keyConcepts": [
      {
        "term": "Switch (Bộ chuyển mạch)",
        "definition": "Thiết bị trung tâm nối các máy trong cùng mạng LAN bằng dây cáp UTP. Switch xây dựng bảng địa chỉ gồm số hiệu cổng và địa chỉ MAC máy trạm.",
        "example": "Switch 24/48 cổng trong phòng máy trường học."
      },
      {
        "term": "Router (Bộ định tuyến)",
        "definition": "Thiết bị kết nối các mạng LAN khác nhau với nhau và kết nối mạng LAN ra Internet. Router tìm đường đi tốt nhất để chuyển gói tin tới đúng địa chỉ IP đích.",
        "example": "Router điều hướng gói tin từ mạng gia đình tới máy chủ Google."
      },
      {
        "term": "IPv4 vs IPv6",
        "definition": "IPv4 dài 32 bit (gần 4,3 tỉ địa chỉ). IPv6 dài 128 bit (2^128 địa chỉ). DNS chuyển đổi tên miền dạng chữ sang IP dạng số.",
        "example": "IPv4: 192.168.1.1 — IPv6: 2402:9d80:85c::1"
      }
    ],
    "theorySections": [
      {
        "title": "1. Các thiết bị mạng trọng tâm",
        "content": "• Switch: Tạo kết nối có dây nội bộ LAN, tra cứu bảng MAC để gửi đích xác cổng nhận.\\n• Access Point (AP): Phát sóng Wi-Fi cho laptop, điện thoại kết nối vào LAN.\\n• Modem: Chuyển đổi tín hiệu số thành tương tự và ngược lại.\\n• Router: Nối mạng LAN với Internet, định tuyến gói tin."
      }
    ],
    "practicalTips": [
      "Mạng Wi-Fi chính là mạng WLAN (mạng cục bộ không dây).",
      "TCP là kiểm soát lỗi và thứ tự truyền tin; IP là tìm đường đi (định tuyến)."
    ],
    "commonPitfalls": [
      "Cho rằng IPv6 dài 6 byte (Sai! IPv6 dài 128 bit = 16 byte).",
      "Nghĩ rằng máy bàn Desktop PC luôn có sẵn Wi-Fi."
    ]
  },
  "12D": {
    "id": "12D",
    "code": "Chủ đề 12D",
    "title": "Đạo đức, Pháp luật và Văn hoá trong Môi trường Số",
    "grade": "12",
    "track": "ALL",
    "examWeight": "Trọng tâm Lớp 12 (~10% lệnh hỏi)",
    "iconName": "shield",
    "summary": "Nắm vững ưu nhược điểm của giao tiếp trong không gian mạng, tác động tiêu cực của công nghệ số, sử dụng dịch vụ Internet đúng luật, phòng tránh hành vi vi phạm đạo đức, văn hoá số và lan toả giá trị nhân văn.",
    "outline": [
      {
        "id": "muc-tieu",
        "title": "Mục tiêu bài học",
        "level": 1
      },
      {
        "id": "muc-do",
        "title": "Mức độ kiến thức và kĩ năng cần đạt",
        "level": 1
      },
      {
        "id": "khoi-dong",
        "title": "Hoạt động khởi động",
        "level": 1
      },
      {
        "id": "sec-1",
        "title": "1. Một số tác động tiêu cực của công nghệ kĩ thuật số",
        "level": 1
      },
      {
        "id": "sec-2",
        "title": "2. Sử dụng dịch vụ Internet đúng luật",
        "level": 1
      },
      {
        "id": "sec-2-a",
        "title": "a) Những hành vi vi phạm pháp luật, trái đạo đức, thiếu văn hoá khi hoạt động trong môi trường số",
        "level": 2
      },
      {
        "id": "sec-2-b",
        "title": "b) Sử dụng dịch vụ Internet đúng luật",
        "level": 2
      },
      {
        "id": "ghi-nho",
        "title": "Ghi nhớ",
        "level": 1
      },
      {
        "id": "luyen-tap",
        "title": "Luyện tập (Trắc nghiệm chuẩn sách)",
        "level": 1
      },
      {
        "id": "van-dung",
        "title": "Vận dụng",
        "level": 1
      }
    ],
    "objectives": [
      "Phân tích được các ưu điểm và nhược điểm về giao tiếp trong thế giới ảo qua các ví dụ thực tiễn đời sống.",
      "Chỉ ra được những tác động tiêu cực của công nghệ số đối với tâm lí, lối sống, hành vi và sức khoẻ của con người.",
      "Nhận diện được những hành vi vi phạm pháp luật, trái chuẩn mực đạo đức và thiếu văn hoá khi tham gia môi trường số.",
      "Hiểu và thực hiện đúng các quy định của pháp luật (Luật An ninh mạng, Luật Sở hữu trí tuệ) khi sử dụng dịch vụ Internet.",
      "Phân tích được tính nhân văn trong ứng xử ở một số tình huống tham gia thế giới ảo và có ý thức lan toả điều tử tế trên mạng xã hội."
    ],
    "standards": [
      {
        "level": "Nhận biết",
        "desc": "Nêu được các ưu điểm và hạn chế cơ bản của giao tiếp mạng (tiết kiệm chi phí, thiếu tín hiệu cơ thể cảm xúc); nhận biết các hành vi sai trái phổ biến (mạo danh, tung tin giả, bạo lực mạng)."
      },
      {
        "level": "Thông hiểu",
        "desc": "Giải thích được vì sao giao tiếp mạng dễ dẫn đến hiểu lầm; phân tích nguyên nhân và hậu quả của lối sống ảo, nghiện Internet, rủi ro bảo mật dữ liệu cá nhân; hiểu các chế tài của pháp luật Việt Nam."
      },
      {
        "level": "Vận dụng",
        "desc": "Ứng xử văn hoá, lịch sự và nhân văn trong các tình huống tranh luận trên mạng; bảo vệ tài khoản cá nhân; chủ động ủng hộ và tham gia các hoạt động thiện nguyện trực tuyến tích cực."
      }
    ],
    "warmUp": {
      "context": "Một bạn học sinh chia sẻ: 'Trên mạng xã hội, mình có thể trò chuyện với bạn bè ở khắp nơi bất cứ lúc nào, thậm chí nói những điều ngoài đời mình không dám nói. Nhưng đôi khi những bình luận ác ý từ những tài khoản ẩn danh khiến mình mất ngủ nhiều ngày liền.'",
      "question": "Theo em, không gian mạng mang lại sự tự do giao tiếp nhưng vì sao lại tiềm ẩn nhiều nguy cơ tổn thương tâm lí? Chúng ta cần làm gì để bảo vệ bản thân và ứng xử nhân văn trên mạng?"
    },
    "mainSections": [
      {
        "id": "sec-1",
        "number": "1.",
        "title": "Một số tác động tiêu cực của công nghệ kĩ thuật số",
        "content": "Không gian mạng mang lại nhiều ưu điểm to lớn như thực hiện giao tiếp mọi lúc mọi nơi, mở rộng kết nối xã hội không giới hạn địa lí, tiết kiệm tối đa thời gian và chi phí đi lại, sinh hoạt. Tuy nhiên, theo sách Hướng dẫn ôn thi tốt nghiệp môn Tin học (trang 48-50), bên cạnh những ưu điểm, giao tiếp trên môi trường số cũng bộc lộ những tác động tiêu cực và hạn chế tiềm ẩn sâu sắc:\\n\\n• 1.1. Thiếu ngôn ngữ hình thể và tín hiệu cảm xúc: Các phương thức giao tiếp như tin nhắn, email thiếu ánh mắt, nét mặt, cử chỉ cơ thể và ngữ điệu âm thanh của giọng nói. Điều này rất dễ gây ra hiểu lầm do người đọc diễn giải sai ý nghĩa của lời văn. Ngoài ra, việc ẩn danh còn tạo cơ hội cho kẻ xấu mạo danh cá nhân, tổ chức uy tín để thực hiện hành vi lừa đảo.\\n\\n• 1.2. Giảm hiệu quả giao tiếp và kĩ năng ngôn ngữ: Lạm dụng ngôn ngữ mạng, teencode, viết tắt tuỳ tiện, sai chính tả, sai ngữ pháp làm xói mòn sự trong sáng của tiếng Việt. Việc bị phân tán bởi thông báo tin nhắn liên tục cũng làm giảm độ tập trung trong học tập và công việc.\\n\\n• 1.3. Nguy cơ nghiện Internet và lối sống ảo: Dành quá nhiều thời gian trên thế giới ảo dẫn đến lười vận động, ngại giao tiếp thực tế ngoài đời, trở nên ngây ngô trong ứng xử xã hội. Hiện tượng câu like, khoe khoang ảo tạo ra tâm lí so sánh, ghen tị và trầm cảm ở thanh thiếu niên.\\n\\n• 1.4. Nguy cơ về bảo mật và lộ lọt quyền riêng tư: Rủi ro bị lộ mật khẩu, mất thông tin cá nhân (CCCD, số điện thoại, tài khoản ngân hàng), bị theo dõi định vị hoặc bị tống tiền qua các nội dung riêng tư nhạy cảm.\\n\\n• 1.5. Phụ thuộc nặng nề vào hạ tầng kĩ thuật: Khi gặp sự cố đứt cáp quang, mất điện hoặc thiết bị không tương thích, việc giao tiếp bị gián đoạn hoàn toàn, ảnh hưởng lớn đến tiến độ học tập và kinh tế."
      },
      {
        "id": "sec-2",
        "number": "2.",
        "title": "Sử dụng dịch vụ Internet đúng luật",
        "content": "Môi trường số không phải là vùng ngoài vòng pháp luật. Mọi hành vi hoạt động trên Internet đều phải tuân thủ Hiến pháp, Luật An ninh mạng, Luật Công nghệ thông tin và Bộ quy tắc ứng xử trên mạng xã hội do Bộ Thông tin và Truyền thông ban hành.",
        "subSections": [
          {
            "id": "sec-2-a",
            "letter": "a)",
            "title": "Những hành vi vi phạm pháp luật, trái đạo đức, thiếu văn hoá khi hoạt động trong môi trường số",
            "content": "Theo quy định của pháp luật Việt Nam và chuẩn mực văn hoá số, các hành vi sau đây bị nghiêm cấm và phải chịu trách nhiệm pháp lí:\\n\\n1. Mạo danh và lừa đảo trực tuyến: Giả mạo tài khoản mạng xã hội của lãnh đạo, cơ quan nhà nước, giáo viên hoặc người thân để vay tiền, chiếm đoạt tài sản.\\n2. Phát tán thông tin sai sự thật (Tin giả - Fake News): Đăng tải hoặc chia sẻ các thông tin chưa được kiểm chứng, tin đồn thất thiệt về dịch bệnh, thiên tai, an ninh trật tự gây hoang mang trong dư luận.\\n3. Xúc phạm danh dự, nhân phẩm và quấy rối trực tuyến (Cyberbullying): Sử dụng từ ngữ lăng mạ, châm chọc, body shaming, công kích cá nhân, kích động bạo lực mạng nhắm vào học sinh, thầy cô hoặc người khác.\\n4. Vi phạm quyền riêng tư và bí mật đời tư: Tự ý chụp ảnh, quay video người khác rồi đăng lên mạng khi chưa được sự đồng ý; chia sẻ dữ liệu cá nhân, tin nhắn riêng tư lên các hội nhóm công cộng.\\n5. Vi phạm bản quyền và sở hữu trí tuệ: Tải về, sao chép, sử dụng trái phép các phần mềm bẻ khoá (crack), sách, ảnh, bài giảng của tác giả khác mà không xin phép hoặc không trích dẫn nguồn hợp pháp."
          },
          {
            "id": "sec-2-b",
            "letter": "b)",
            "title": "Sử dụng dịch vụ Internet đúng luật và ứng xử nhân văn",
            "content": "Để xây dựng môi trường mạng an toàn, văn minh và nhân văn, học sinh cần rèn luyện các nguyên tắc chuẩn mực sau:\\n\\n1. Thấu hiểu và đồng cảm: Luôn suy nghĩ trước khi bình luận; biết đặt mình vào hoàn cảnh của người khác; chia sẻ và động viên chân thành khi thấy bạn bè gặp khó khăn.\\n2. Ứng xử có văn hoá, lịch sự: Sử dụng ngôn ngữ chuẩn mực, văn minh; tôn trọng sự khác biệt về quan điểm, sở thích; kiên quyết không dùng từ ngữ kích động phân biệt vùng miền, giới tính hay tôn giáo.\\n3. Lan toả những điều tốt đẹp: Tích cực chia sẻ các tấm gương người tốt, việc tốt, các chương trình thiện nguyện giúp đỡ đồng bào bị ảnh hưởng bởi thiên tai bão lũ; lan toả nguồn cảm hứng học tập tích cực.\\n4. Đấu tranh với cái xấu một cách văn minh: Bày tỏ sự phản đối, không tiếp tay chia sẻ các bài viết độc hại; chủ động báo cáo (report) nội dung vi phạm cho nền tảng mạng xã hội hoặc cơ quan chức năng.\\n5. Nâng cao kĩ năng tự bảo vệ: Cài đặt mật khẩu mạnh (chữ hoa, số, kí tự đặc biệt), bật xác thực 2 lớp (2FA), không bấm vào các đường link lạ và cẩn trọng với các yêu cầu kết bạn từ người lạ."
          }
        ],
        "table": {
          "headers": [
            "Hành vi trong môi trường số",
            "Đánh giá chuẩn mực",
            "Hậu quả / Biện pháp xử lí"
          ],
          "rows": [
            [
              "Mạo danh người thân mượn tiền qua Deepfake",
              "Vi phạm pháp luật nghiêm trọng (Tội lừa đảo)",
              "Bị truy cứu trách nhiệm hình sự, phạt tù"
            ],
            [
              "Chia sẻ bài viết cảnh báo dịch bệnh không rõ nguồn gốc",
              "Vi phạm Luật An ninh mạng (Phát tán tin giả)",
              "Bị xử phạt vi phạm hành chính từ 5 - 10 triệu đồng"
            ],
            [
              "Chụp lén ảnh bạn ngủ trong lớp rồi chế meme đăng lên mạng",
              "Trái đạo đức, thiếu văn hoá, xâm phạm quyền riêng tư",
              "Bạn bè tẩy chay, nhà trường kỉ luật, buộc gỡ bỏ và xin lỗi"
            ],
            [
              "Quyên góp, ủng hộ đồng bào lũ lụt qua cổng thông tin chính thống",
              "Ứng xử nhân văn, lan toả giá trị tốt đẹp",
              "Xây dựng cộng đồng tương thân tương ái"
            ]
          ]
        }
      }
    ],
    "memoryNotes": [
      "Giao tiếp trong không gian mạng KHÔNG nhất thiết luôn giúp cải thiện kĩ năng giao tiếp trực tiếp do thiếu ngôn ngữ cơ thể và cảm xúc.",
      "Ưu điểm lớn nhất của giao tiếp mạng là tiết kiệm thời gian, công sức và chi phí do không cần di chuyển đến cùng một nơi.",
      "Môi trường mạng chịu sự điều chỉnh của Luật An ninh mạng; mọi hành vi bôi nhọ, phát tán tin giả, mạo danh đều bị xử phạt nghiêm minh.",
      "Nguyên tắc vàng: 'Hãy đối xử với người khác trên mạng như cách em muốn được đối xử ngoài đời thực'."
    ],
    "practiceQuestions": [
      {
        "id": "12d-q1",
        "question": "Câu 1. Giao tiếp trong không gian mạng KHÔNG có ưu điểm nào sau đây?",
        "options": {
          "A": "Thực hiện ở mọi lúc, mọi nơi.",
          "B": "Mở rộng kết nối xã hội và khả năng tương tác.",
          "C": "Tiết kiệm thời gian, công sức hoặc chi phí.",
          "D": "Luôn giúp cải thiện kĩ năng giao tiếp."
        },
        "correctAnswer": "D",
        "explanation": "Trích nguyên văn đáp án sách Hướng dẫn ôn thi tốt nghiệp môn Tin học (trang 177): 'D. Phương án D sai vì giao tiếp trong không gian mạng thiếu các tín hiệu cảm xúc, ngôn ngữ hình thể và âm điệu tiếng nói nên không nhất thiết luôn giúp cải thiện kĩ năng giao tiếp trực tiếp của con người.'"
      },
      {
        "id": "12d-q2",
        "question": "Câu 2. Giao tiếp trong không gian mạng KHÔNG có hạn chế nào sau đây?",
        "options": {
          "A": "Luôn thiếu ngôn ngữ hình thể, thiếu tín hiệu cảm xúc.",
          "B": "Nghiện Internet với hàng giờ giao lưu trên mạng.",
          "C": "Có thể gặp rủi ro về bảo mật và quyền riêng tư.",
          "D": "Phụ thuộc vào các phương tiện giao tiếp kĩ thuật số."
        },
        "correctAnswer": "A",
        "explanation": "Trích nguyên văn đáp án sách (trang 177): 'Phương án A không phải là hạn chế của mọi hình thức giao tiếp, ví dụ khi gọi video call (hội nghị truyền hình) người tham gia vẫn có thể nhìn thấy hình ảnh và cử chỉ nét mặt của đối phương.'"
      },
      {
        "id": "12d-q3",
        "question": "Câu 3. Hành động nào sau đây khó thực hiện được đầy đủ nhất khi ứng xử nhân văn trong không gian mạng?",
        "options": {
          "A": "Chia sẻ, đồng cảm với những hoàn cảnh khó khăn.",
          "B": "Ứng xử có văn hoá, thể hiện tính nhân văn khi giao tiếp.",
          "C": "Ủng hộ người làm việc tốt và tham gia làm việc tốt đó.",
          "D": "Phê phán và phản đối những việc xấu, người xấu."
        },
        "correctAnswer": "D",
        "explanation": "Trích nguyên văn đáp án sách (trang 177): 'D. Việc phê phán và phản đối những việc xấu, người xấu trên không gian mạng là khó thực hiện đầy đủ nhất vì dễ dẫn đến tranh cãi gay gắt, bị tấn công mạng ngược lại hoặc thiếu thông tin khách quan toàn diện để đánh giá đúng bản chất sự việc.'"
      },
      {
        "id": "12d-q4",
        "question": "Câu 4. Đặc điểm nào sau đây của giao tiếp trong không gian mạng thể hiện rõ nhất ưu điểm tiết kiệm thời gian, công sức và chi phí?",
        "options": {
          "A": "Tạo điều kiện thuận lợi cho việc lưu trữ nội dung trò chuyện.",
          "B": "Không cần di chuyển đến cùng một nơi để tham gia.",
          "C": "Các công cụ giao tiếp đa dạng miễn sao có kết nối mạng.",
          "D": "Nhiều người có thể tham gia ở các thời điểm khác nhau."
        },
        "correctAnswer": "B",
        "explanation": "Trích nguyên văn đáp án sách (trang 177): 'B. Không cần phải di chuyển đến cùng một địa điểm giúp người tham gia tiết kiệm tối đa thời gian đi lại, chi phí phương tiện và chi phí sinh hoạt phát sinh.'"
      }
    ],
    "application": {
      "realLife": "Khi đọc một bài viết bóc phốt hoặc thông tin giật gân chưa được báo chí chính thống xác nhận, em không nên vội vã nhấn like, share hay bình luận chỉ trích. Hãy kiểm tra nguồn tin, tìm kiếm thông tin đối chứng trên các trang báo điện tử chính thống của Nhà nước.",
      "examTraps": [
        "Bẫy 1: Nghĩ rằng giao tiếp qua mạng luôn giúp nâng cao kĩ năng nói và nghe (Sai, nhắn tin quá nhiều thực tế làm giảm phản xạ giao tiếp đời thực).",
        "Bẫy 2: Nhầm lẫn giữa quyền tự do ngôn luận với hành vi bôi nhọ, xúc phạm danh dự người khác (Mọi lời xúc phạm đều vi phạm Luật An ninh mạng)."
      ],
      "tips": [
        "Học thuộc 4 ưu điểm: Mọi lúc mọi nơi; Mở rộng kết nối; Tiết kiệm thời gian/chi phí; Có thể hỗ trợ người nhút nhát.",
        "Nắm vững 5 hạn chế: Thiếu ngôn ngữ cơ thể; Giảm hiệu quả do viết tắt; Nghiện mạng; Nguy cơ bảo mật; Phụ thuộc công nghệ."
      ]
    },
    "requirements": [
      "Phân tích được ưu và nhược điểm về giao tiếp trong thế giới ảo qua các ví dụ cụ thể.",
      "Phân tích được tính nhân văn trong ứng xử ở một số tình huống tham gia thế giới ảo.",
      "Nêu được một số tác động tiêu cực của công nghệ kĩ thuật số đối với đời sống con người.",
      "Nhận diện được các hành vi vi phạm pháp luật khi hoạt động trong môi trường số."
    ],
    "keyConcepts": [
      {
        "term": "Ưu điểm giao tiếp số",
        "definition": "Mọi lúc mọi nơi, mở rộng kết nối xã hội, tiết kiệm chi phí, hỗ trợ người khiếm khuyết/nhút nhát trao đổi.",
        "example": "Họp trực tuyến qua Google Meet tiết kiệm hàng triệu đồng vé máy bay."
      },
      {
        "term": "Hạn chế giao tiếp số",
        "definition": "Thiếu cảm xúc phi ngôn ngữ, viết tắt bừa bãi làm sai lệch ngữ pháp, nguy cơ nghiện Internet và mất an toàn dữ liệu.",
        "example": "Hiểu lầm ý bạn bè khi đọc tin nhắn không có ngữ điệu."
      },
      {
        "term": "Ứng xử nhân văn",
        "definition": "Tôn trọng người khác, lan toả điều tích cực, bảo vệ lẽ phải, lên án cái xấu bằng biện pháp văn minh.",
        "example": "Ủng hộ quỹ vaccine hoặc quyên góp cứu trợ bão lũ qua ứng dụng ngân hàng."
      }
    ],
    "theorySections": [
      {
        "title": "1. Ưu điểm nổi bật của giao tiếp trực tuyến",
        "content": "– Thực hiện linh hoạt mọi lúc mọi nơi.\\n– Mở rộng mạng lưới quan hệ quốc tế.\\n– Tiết kiệm chi phí đi lại và sinh hoạt."
      },
      {
        "title": "2. Mặt trái và quy định pháp luật cần nhớ",
        "content": "– Luật An ninh mạng xử phạt nghiêm khắc hành vi tung tin giả, bôi nhọ người khác.\\n– Cần bảo mật mật khẩu và hạn chế chia sẻ dữ liệu nhạy cảm."
      }
    ],
    "practicalTips": [
      "Nhớ câu hỏi bẫy: Giao tiếp mạng KHÔNG PHẢI luôn cải thiện kĩ năng giao tiếp trực tiếp.",
      "Ưu điểm tiết kiệm chi phí thể hiện rõ nhất ở việc: Không cần di chuyển đến cùng một nơi."
    ],
    "commonPitfalls": [
      "Nghĩ rằng không gian mạng là vô danh nên không bị pháp luật điều chỉnh.",
      "Nhầm lẫn giữa phê phán hành vi xấu với việc bạo lực mạng nhục mạ cá nhân."
    ]
  },
  "12F": {
    "id": "12F",
    "code": "Chủ đề 12F",
    "title": "Tạo trang web với HTML và CSS",
    "grade": "12",
    "track": "ALL",
    "examWeight": "Trọng tâm Lớp 12 (~20% lệnh hỏi)",
    "iconName": "code",
    "summary": "Nắm vững cấu trúc trang web HTML5, các thẻ định dạng văn bản, danh sách, bảng, siêu liên kết, biểu mẫu form, đa phương tiện video/audio/iframe và mô hình hộp CSS Box Model, quy tắc bộ chọn (Selector).",
    "outline": [
      {
        "id": "muc-tieu",
        "title": "Mục tiêu bài học",
        "level": 1
      },
      {
        "id": "muc-do",
        "title": "Mức độ kiến thức và kĩ năng cần đạt",
        "level": 1
      },
      {
        "id": "khoi-dong",
        "title": "Hoạt động khởi động",
        "level": 1
      },
      {
        "id": "sec-1",
        "title": "1. Ngôn ngữ đánh dấu siêu văn bản HTML",
        "level": 1
      },
      {
        "id": "sec-1-1",
        "title": "a) Cấu trúc tài liệu HTML5 và các phần tử cơ bản",
        "level": 2
      },
      {
        "id": "sec-1-2",
        "title": "b) Định dạng văn bản, danh sách và bảng trong HTML",
        "level": 2
      },
      {
        "id": "sec-2",
        "title": "2. Siêu liên kết, đa phương tiện và biểu mẫu (Form)",
        "level": 1
      },
      {
        "id": "sec-2-a",
        "title": "a) Siêu liên kết và nhúng hình ảnh, âm thanh, video",
        "level": 2
      },
      {
        "id": "sec-2-b",
        "title": "b) Xây dựng biểu mẫu nhập dữ liệu (Form)",
        "level": 2
      },
      {
        "id": "sec-3",
        "title": "3. Định kiểu trang web với CSS",
        "level": 1
      },
      {
        "id": "sec-3-a",
        "title": "a) Cách chèn CSS và độ ưu tiên bộ chọn (Selector)",
        "level": 2
      },
      {
        "id": "sec-3-b",
        "title": "b) Mô hình hộp (CSS Box Model)",
        "level": 2
      },
      {
        "id": "ghi-nho",
        "title": "Ghi nhớ",
        "level": 1
      },
      {
        "id": "luyen-tap",
        "title": "Luyện tập (Trắc nghiệm chuẩn sách)",
        "level": 1
      },
      {
        "id": "van-dung",
        "title": "Vận dụng",
        "level": 1
      }
    ],
    "objectives": [
      "Hiểu và trình bày được cấu trúc chuẩn của tài liệu HTML5: <!DOCTYPE html>, <html>, <head>, <title>, <body>.",
      "Sử dụng thành thạo các thẻ định dạng văn bản: <h1>-<h6>, <p>, <strong>, <em>, <u>, <br>, <hr>.",
      "Thiết lập được bảng dữ liệu với thẻ <table>, <tr>, <td>, <th> và danh sách có thứ tự <ol>, không thứ tự <ul>.",
      "Tạo siêu liên kết với thẻ <a> và thuộc tính href; nhúng hình ảnh <img>, tệp âm thanh <audio>, tệp video <video>.",
      "Thiết kế biểu mẫu <form> gồm các trường <input> (text, password, radio, checkbox), <select>, <textarea>, <button>.",
      "Áp dụng CSS: 3 phương thức chèn CSS, quy tắc tính độ ưu tiên (Specificity), và mô hình hộp Box Model (margin, border, padding, content)."
    ],
    "standards": [
      {
        "level": "Nhận biết",
        "desc": "Nhận biết các thẻ HTML cơ bản; thuộc tính src trong thẻ <img>, href trong thẻ <a>; cấu tạo 4 lớp của CSS Box Model."
      },
      {
        "level": "Thông hiểu",
        "desc": "Phân biệt được thẻ khối (block-level) và thẻ nội dòng (inline); hiểu độ ưu tiên của các loại CSS selector (#id, .class, element); phân biệt được method GET và POST trong thẻ <form>."
      },
      {
        "level": "Vận dụng",
        "desc": "Viết mã HTML/CSS hoàn chỉnh cho một trang web giới thiệu cá nhân có biểu mẫu liên hệ, danh mục và video giới thiệu."
      }
    ],
    "warmUp": {
      "context": "Khi nhấp chuột phải vào bất kì trang web nào trên trình duyệt và chọn 'Kiểm tra' (Inspect) hoặc 'Xem nguồn trang' (View Page Source), em sẽ thấy hàng ngàn dòng mã văn bản có các dấu ngoặc nhọn < >.",
      "question": "Những thẻ < > đó là gì? Làm thế nào trình duyệt có thể biến những đoạn mã đánh dấu thành giao diện đẹp mắt với hình ảnh, màu sắc và video sống động?"
    },
    "mainSections": [
      {
        "id": "sec-1",
        "number": "1.",
        "title": "Ngôn ngữ đánh dấu siêu văn bản HTML",
        "content": "HTML (HyperText Markup Language) là ngôn ngữ đánh dấu chuẩn để xây dựng cấu trúc của các trang web trên Internet.\\nMột phần tử HTML gồm thẻ mở <tên_thẻ thuộc_tính='giá_trị'>, nội dung và thẻ đóng </tên_thẻ>. Một số thẻ đơn không cần thẻ đóng như <br>, <hr>, <img>, <input>.",
        "subSections": [
          {
            "id": "sec-1-1",
            "letter": "a)",
            "title": "Cấu trúc tài liệu HTML5 chuẩn",
            "content": "Mọi trang web chuẩn HTML5 đều có khung sườn bắt buộc:\\n• <!DOCTYPE html>: Khai báo phiên bản HTML5 cho trình duyệt.\\n• <html lang='vi'>: Phần tử gốc chứa toàn bộ nội dung tài liệu web.\\n• <head>: Chứa siêu dữ liệu (metadata), tiêu đề trang <title>, liên kết tệp CSS <link> và bộ mã kí tự <meta charset='UTF-8'>. Phần này không hiển thị trực tiếp trong thân trang.\\n• <body>: Chứa toàn bộ nội dung hiển thị cho người xem (tiêu đề, hình ảnh, văn bản, video).",
            "codeSnippet": "<!DOCTYPE html>\\n<html lang=\\\"vi\\\">\\n  <head>\\n    <meta charset=\\\"UTF-8\\\">\\n    <title>Trang web đầu tiên của tôi</title>\\n    <link rel=\\\"stylesheet\\\" href=\\\"style.css\\\">\\n  </head>\\n  <body>\\n    <h1>Xin chào các bạn!</h1>\\n    <p>Chào mừng bạn đến với TinPath.</p>\\n  </body>\\n</html>"
          },
          {
            "id": "sec-1-2",
            "letter": "b)",
            "title": "Định dạng văn bản, danh sách và bảng trong HTML",
            "content": "• Tiêu đề (Headings): Từ <h1> (lớn nhất) đến <h6> (nhỏ nhất).\\n• Đoạn văn bản: Thẻ <p>. In đậm: <strong> hoặc <b>. In nghiêng: <em> hoặc <i>. Xuống dòng: <br>. Đường kẻ ngang phân cách: <hr>.\\n• Danh sách: Có thứ tự <ol type='1' start='1'> và Không thứ tự <ul type='disc'>. Mỗi mục trong danh sách bắt đầu bằng thẻ <li>.\\n• Bảng dữ liệu (Table): Khai báo bằng <table>. Mỗi hàng là <tr> (Table Row). Ô tiêu đề cột in đậm canh giữa là <th> (Table Header). Ô dữ liệu thông thường là <td> (Table Data). Thuộc tính rowspan gộp hàng, colspan gộp cột.",
            "codeSnippet": "<table border=\\\"1\\\">\\n  <tr>\\n    <th>Họ và tên</th>\\n    <th>Điểm Tin</th>\\n  </tr>\\n  <tr>\\n    <td>Nguyễn Văn An</td>\\n    <td>9.5</td>\\n  </tr>\\n</table>"
          }
        ]
      },
      {
        "id": "sec-2",
        "number": "2.",
        "title": "Siêu liên kết, đa phương tiện và biểu mẫu (Form)",
        "content": "Siêu liên kết giúp kết nối các tài nguyên web; đa phương tiện làm trang web hấp dẫn; biểu mẫu form cho phép người dùng gửi dữ liệu tương tác lên máy chủ.",
        "subSections": [
          {
            "id": "sec-2-a",
            "letter": "a)",
            "title": "Siêu liên kết và nhúng đa phương tiện",
            "content": "• Siêu liên kết: Dùng thẻ <a> với thuộc tính href chỉ định URL đích. Thuộc tính target='_blank' giúp mở liên kết trong tab mới.\\n• Chèn ảnh: Thẻ đơn <img> với thuộc tính bắt buộc src='đường_dẫn' và alt='mô tả ảnh' khi ảnh bị lỗi.\\n• Chèn âm thanh và video: Thẻ <audio controls> và <video controls width='640'> với thẻ con <source src='...' type='video/mp4'>.\\n• Khung nội tuyến <iframe>: Nhúng tài liệu hoặc video từ trang web khác (ví dụ: Google Maps, video YouTube).",
            "codeSnippet": "<a href=\\\"https://moet.gov.vn\\\" target=\\\"_blank\\\">Cổng thông tin Bộ GD&ĐT</a>\\n<img src=\\\"logo.png\\\" alt=\\\"Logo TinPath\\\" width=\\\"120\\\">\\n<video controls width=\\\"400\\\">\\n  <source src=\\\"baihoc.mp4\\\" type=\\\"video/mp4\\\">\\n</video>"
          },
          {
            "id": "sec-2-b",
            "letter": "b)",
            "title": "Xây dựng biểu mẫu nhập dữ liệu (Form)",
            "content": "Thẻ <form action='xuly.php' method='POST'> chứa các phần tử nhập dữ liệu:\\n• <input type='text'>: Ô nhập một dòng chữ.\\n• <input type='password'>: Ô nhập mật khẩu (che dấu chấm).\\n• <input type='radio' name='gender'>: Nút chọn hình tròn (trong cùng name chỉ chọn được 1 phương án duy nhất).\\n• <input type='checkbox'>: Ô kiểm vuông cho phép chọn nhiều phương án.\\n• <select> cùng các thẻ con <option>: Danh sách chọn thả xuống (dropdown).\\n• <textarea rows='4' cols='50'>: Ô nhập văn bản nhiều dòng.\\n• <button type='submit'> hoặc <input type='submit'>: Nút gửi dữ liệu lên máy chủ."
          }
        ]
      },
      {
        "id": "sec-3",
        "number": "3.",
        "title": "Định kiểu trang web với CSS",
        "content": "CSS (Cascading Style Sheets) quy định màu sắc, kích thước, font chữ và bố cục hiển thị của trang web.",
        "subSections": [
          {
            "id": "sec-3-a",
            "letter": "a)",
            "title": "Cách chèn CSS và độ ưu tiên bộ chọn (Selector)",
            "content": "• 3 cách chèn CSS:\\n1. Inline CSS: Viết trực tiếp trong thuộc tính style của thẻ (ví dụ: <p style='color: red;'>).\\n2. Internal CSS: Viết trong khối thẻ <style> đặt bên trong phần tử <head>.\\n3. External CSS (Khuyến nghị): Viết trong tệp .css riêng biệt và liên kết qua thẻ <link rel='stylesheet' href='style.css'>.\\n• Độ ưu tiên bộ chọn (Specificity):\\n!important (Cao nhất) > Inline style > ID selector (#id) > Class selector (.class) > Element selector (tên thẻ p, h1, div). Nếu cùng cấp độ ưu tiên, quy tắc viết sau sẽ ghi đè quy tắc viết trước."
          },
          {
            "id": "sec-3-b",
            "letter": "b)",
            "title": "Mô hình hộp (CSS Box Model)",
            "content": "Mọi phần tử HTML hiển thị trên trang web đều được xem như một chiếc hộp hình chữ nhật, gồm 4 lớp từ trong ra ngoài:\\n1. Content (Nội dung): Vùng chứa văn bản hoặc hình ảnh thực tế (xác định bởi thuộc tính width và height).\\n2. Padding (Vùng đệm): Khoảng cách trong suốt ngăn cách giữa Content và Border.\\n3. Border (Đường viền): Đường bao quanh bọc lấy padding và content.\\n4. Margin (Lề ngoài): Khoảng cách trống bên ngoài đường viền, ngăn cách phần tử với các phần tử lân cận xung quanh.",
            "codeSnippet": ".box {\\n  width: 300px;\\n  padding: 15px;\\n  border: 2px solid #2878C8;\\n  margin: 20px auto;\\n}"
          }
        ]
      }
    ],
    "memoryNotes": [
      "Phần tử <title> nằm trong <head>, quyết định tên hiển thị trên thanh tiêu đề trình duyệt.",
      "<img>, <input>, <br>, <hr> là các thẻ rỗng (không cần thẻ đóng).",
      "Thẻ <a> dùng thuộc tính href; thẻ <img> dùng thuộc tính src và alt.",
      "Mô hình hộp Box Model từ trong ra ngoài: Content -> Padding -> Border -> Margin.",
      "Độ ưu tiên CSS: !important > ID (#) > Class (.) > Tag name."
    ],
    "practiceQuestions": [
      {
        "id": "12f-q1",
        "question": "Câu 1. Phần tử nào trong tài liệu HTML chứa các thông tin mô tả siêu dữ liệu (metadata) của trang web?",
        "options": {
          "A": "<body>",
          "B": "<h1>",
          "C": "<head>",
          "D": "<title>"
        },
        "correctAnswer": "C",
        "explanation": "Trích nguyên văn đáp án sách Hướng dẫn ôn thi tốt nghiệp môn Tin học (trang 173): 'C. Phần tử <head> chứa các thông tin siêu dữ liệu (metadata) của trang web, tệp CSS liên kết, bộ mã kí tự và tiêu đề trang web.'"
      },
      {
        "id": "12f-q2",
        "question": "Câu 2. Trong các phần mềm sau đây, phần mềm nào KHÔNG dùng để soạn thảo mã HTML?",
        "options": {
          "A": "Notepad.",
          "B": "Visual Studio Code.",
          "C": "Sublime Text.",
          "D": "Google Chrome."
        },
        "correctAnswer": "D",
        "explanation": "Trích nguyên văn đáp án sách (trang 174): 'D. Phương án D đúng vì Google Chrome là trình duyệt web dùng để hiển thị và biên dịch trang web, không phải là phần mềm soạn thảo mã nguồn.'"
      },
      {
        "id": "12f-q3",
        "question": "Câu 3. Thuộc tính nào trong thẻ <a> được dùng để xác định địa chỉ URL của trang web cần liên kết tới?",
        "options": {
          "A": "src",
          "B": "href",
          "C": "link",
          "D": "url"
        },
        "correctAnswer": "B",
        "explanation": "Trích nguyên văn đáp án sách (trang 174): 'B. Thuộc tính href (Hypertext Reference) trong thẻ <a> chỉ định địa chỉ URL của siêu liên kết. Thẻ <link> dùng để liên kết tệp CSS, không có thẻ <url>.'"
      },
      {
        "id": "12f-q4",
        "question": "Câu 4. Trong mô hình hộp CSS Box Model, lớp nào nằm ngay bên ngoài đường viền (Border) để tạo khoảng cách với các phần tử xung quanh?",
        "options": {
          "A": "Padding",
          "B": "Content",
          "C": "Margin",
          "D": "Outline"
        },
        "correctAnswer": "C",
        "explanation": "Trích nguyên văn đáp án sách (trang 174): 'C. Margin (lề ngoài) là khoảng cách nằm ngoài cùng bọc quanh đường viền border, dùng để ngăn cách giữa các phần tử với nhau.'"
      },
      {
        "id": "12f-q5",
        "question": "Câu 5. Trong CSS, bộ chọn nào sau đây có độ ưu tiên cao nhất khi cùng tác động lên một phần tử?",
        "options": {
          "A": "Bộ chọn tên thẻ (Element selector: p, h1)",
          "B": "Bộ chọn lớp (Class selector: .highlight)",
          "C": "Bộ chọn định danh (ID selector: #header)",
          "D": "Bộ chọn nhóm (Grouping selector: h1, h2)"
        },
        "correctAnswer": "C",
        "explanation": "Trích nguyên văn đáp án sách (trang 174): 'C. Bộ chọn ID (#) có độ ưu tiên cao hơn Class (.), và Class có độ ưu tiên cao hơn tên thẻ HTML thông thường.'"
      }
    ],
    "application": {
      "realLife": "Khi thiết kế nút bấm trên website, luôn đặt padding đủ lớn (ví dụ: padding: 12px 24px) để người dùng trên điện thoại cảm ứng dễ dàng chạm trúng mà không bị bấm nhầm.",
      "examTraps": [
        "Bẫy 1: Nhầm lẫn giữa thuộc tính src (dùng cho <img>, <script>, <iframe>) và href (dùng cho <a>, <link>).",
        "Bẫy 2: Nhầm padding là khoảng cách bên ngoài viền (Sai, Padding ở bên trong viền, Margin mới ở ngoài viền!).",
        "Bẫy 3: Cho rằng <input type='radio'> cho phép chọn nhiều phương án (Sai, radio chỉ chọn 1, checkbox mới chọn nhiều)."
      ],
      "tips": [
        "Ghi nhớ cấu trúc Box Model: Trong cùng là Content -> Kế tiếp là Padding -> Đến Border -> Ngoài cùng là Margin.",
        "Thẻ <h1> chỉ nên xuất hiện 1 lần duy nhất trên mỗi trang web để tối ưu SEO."
      ]
    },
    "requirements": [
      "Hiểu cấu trúc tài liệu HTML5: <!DOCTYPE html>, <html>, <head>, <title>, <body>.",
      "Sử dụng các thẻ định dạng: <h1>-<h6>, <p>, <strong>, <em>, <u>.",
      "Tạo siêu liên kết với thẻ <a> và thuộc tính href.",
      "Tạo bảng <table>, <tr>, <td>, <th>, <caption>.",
      "Tạo danh sách có thứ tự <ol> và không thứ tự <ul>.",
      "Chèn đa phương tiện: <img>, <audio>, <video>, <iframe>.",
      "Xây dựng biểu mẫu <form>: <input>, <textarea>, <select>, <button>.",
      "Áp dụng CSS: Box Model (content, padding, border, margin), CSS Selectors."
    ],
    "keyConcepts": [
      {
        "term": "Thẻ rỗng (Void elements)",
        "definition": "Những thẻ không có nội dung và không có thẻ đóng như <img>, <input>, <br>, <hr>.",
        "example": "<img src='anh.jpg' alt='minh hoa'>"
      },
      {
        "term": "CSS Box Model",
        "definition": "Gồm 4 thành phần: Content (nội dung), Padding (đệm trong), Border (đường viền), Margin (lề ngoài).",
        "example": "padding: 10px; margin: 20px;"
      }
    ],
    "theorySections": [
      {
        "title": "1. Các thẻ định dạng cấu trúc",
        "content": "• <h1>-<h6>: Tiêu đề\\n• <p>: Đoạn văn\\n• <a>: Siêu liên kết\\n• <img>: Chèn ảnh"
      }
    ],
    "practicalTips": [
      "Nhớ quy tắc Box Model: Content -> Padding -> Border -> Margin."
    ],
    "commonPitfalls": [
      "Nhầm src với href."
    ]
  },
  "12G": {
    "id": "12G",
    "code": "Chủ đề 12G",
    "title": "Nhóm nghề Dịch vụ và Quản trị Mạng",
    "grade": "12",
    "track": "ALL",
    "examWeight": "Trọng tâm Lớp 12 (~10% lệnh hỏi)",
    "iconName": "briefcase",
    "summary": "Tìm hiểu chi tiết các nghề nghiệp cốt lõi trong thời đại số: Nghề Sửa chữa và bảo trì máy tính; Nghề Quản trị mạng và hệ thống; Nghề Bảo mật hệ thống thông tin. Nhu cầu nhân lực và định hướng đào tạo tương lai.",
    "outline": [
      {
        "id": "muc-tieu",
        "title": "Mục tiêu bài học",
        "level": 1
      },
      {
        "id": "muc-do",
        "title": "Mức độ kiến thức và kĩ năng cần đạt",
        "level": 1
      },
      {
        "id": "khoi-dong",
        "title": "Hoạt động khởi động",
        "level": 1
      },
      {
        "id": "sec-1",
        "title": "1. Nghề Sửa chữa và bảo trì máy tính",
        "level": 1
      },
      {
        "id": "sec-2",
        "title": "2. Nghề Quản trị mạng và hệ thống",
        "level": 1
      },
      {
        "id": "sec-3",
        "title": "3. Nghề Bảo mật hệ thống thông tin",
        "level": 1
      },
      {
        "id": "ghi-nho",
        "title": "Ghi nhớ",
        "level": 1
      },
      {
        "id": "luyen-tap",
        "title": "Luyện tập (Trắc nghiệm chuẩn sách)",
        "level": 1
      },
      {
        "id": "van-dung",
        "title": "Vận dụng",
        "level": 1
      }
    ],
    "objectives": [
      "Trình bày được đặc điểm, công việc chính của nghề Sửa chữa và bảo trì máy tính.",
      "Mô tả được vai trò, nhiệm vụ và yêu cầu chuyên môn của nghề Quản trị mạng và hệ thống.",
      "Phân tích được tầm quan trọng và nhu cầu nhân lực cấp thiết của nghề Bảo mật hệ thống thông tin.",
      "Nắm được các bậc học và định hướng nghề nghiệp tiếp theo sau khi tốt nghiệp THPT."
    ],
    "standards": [
      {
        "level": "Nhận biết",
        "desc": "Nêu được tên gọi các nghề trong nhóm dịch vụ CNTT; nhận biết công việc bảo trì phần cứng và cài đặt phần mềm."
      },
      {
        "level": "Thông hiểu",
        "desc": "Phân biệt được sự khác nhau giữa kĩ thuật viên sửa chữa máy tính với kĩ sư quản trị hệ thống mạng; hiểu vai trò của an toàn thông tin."
      },
      {
        "level": "Vận dụng",
        "desc": "Lựa chọn định hướng ngành học phù hợp với năng lực bản thân tại các trường cao đẳng, đại học kĩ thuật."
      }
    ],
    "warmUp": {
      "context": "Một công ty bất ngờ bị ngắt kết nối Internet toàn bộ trụ sở và nghi ngờ máy chủ cơ sở dữ liệu khách hàng bị tấn công mạng xâm nhập.",
      "question": "Những nhân sự thuộc chuyên môn nào trong công ty sẽ chịu trách nhiệm khắc phục sự cố này? Yêu cầu công việc của họ là gì?"
    },
    "mainSections": [
      {
        "id": "sec-1",
        "number": "1.",
        "title": "Nghề Sửa chữa và bảo trì máy tính",
        "content": "• Công việc chính: Kiểm tra, chẩn đoán sự cố phần cứng (RAM, ổ cứng, nguồn, bo mạch chủ), vệ sinh máy tính; cài đặt và cập nhật hệ điều hành, trình điều khiển (driver) và các phần mềm ứng dụng thông dụng; tối ưu hoá cấu hình hệ thống.\\n• Yêu cầu: Hiểu sâu về cấu trúc máy tính, có kĩ năng thao tác cẩn thận, tỉ mỉ và kĩ năng giao tiếp, tư vấn hỗ trợ khách hàng. Không nhất thiết phải biết lập trình phần mềm."
      },
      {
        "id": "sec-2",
        "number": "2.",
        "title": "Nghề Quản trị mạng và hệ thống",
        "content": "• Công việc chính: Thiết kế, lắp đặt, cấu hình các thiết bị mạng (Switch, Router, Firewall, Server); quản lí tài khoản người dùng, phân quyền truy cập tài nguyên; giám sát lưu lượng và hiệu năng mạng, sao lưu dữ liệu dự phòng và xử lí sự cố mạng 24/7.\\n• Yêu cầu: Nắm vững các mô hình mạng OSI, bộ giao thức TCP/IP, hệ điều hành mạng (Windows Server, Linux), kiến thức định tuyến, chuyển mạch và chứng chỉ nghề nghiệp quốc tế (CCNA, MCSA). Cần được đào tạo bài bản ở bậc đại học hoặc cao đẳng."
      },
      {
        "id": "sec-3",
        "number": "3.",
        "title": "Nghề Bảo mật hệ thống thông tin",
        "content": "• Tầm quan trọng: Trong kỉ nguyên chuyển đổi số, dữ liệu là tài sản quý giá nhất của tổ chức. Năm 2023 tại Việt Nam ghi nhận gần 14.000 vụ tấn công mạng vào các cơ quan, ngân hàng và doanh nghiệp.\\n• Công việc chính: Đánh giá lỗ hổng bảo mật, thiết lập tường lửa (Firewall), triển khai các hệ thống phát hiện và ngăn chặn xâm nhập (IDS/IPS), phòng chống mã độc, xử lí khủng hoảng khi bị rò rỉ dữ liệu hoặc tống tiền bằng ransomware.\\n• Nhu cầu nhân lực: Đang thiếu hụt trầm trọng với mức thu nhập hàng đầu trong ngành công nghệ thông tin."
      }
    ],
    "memoryNotes": [
      "Nghề Sửa chữa bảo trì máy tính KHÔNG bắt buộc phải biết lập trình.",
      "Quản trị mạng yêu cầu cấu hình thiết bị (Switch, Router) và phân quyền hệ thống.",
      "Bảo mật thông tin là nghề then chốt bảo vệ an toàn quốc gia và tài sản số của doanh nghiệp."
    ],
    "practiceQuestions": [
      {
        "id": "12g-q1",
        "question": "Câu 1. Phát biểu nào sau đây mô tả đúng về nghề Sửa chữa và bảo trì máy tính?",
        "options": {
          "A": "Yêu cầu phải biết lập trình.",
          "B": "Không đòi hỏi kĩ năng giao tiếp.",
          "C": "Yêu cầu phải biết điều chỉnh, tối ưu hoá các thông số cấu hình cho hệ điều hành và các phần mềm ứng dụng.",
          "D": "Yêu cầu phải biết sử dụng thành thạo tất cả những phần mềm ứng dụng thường gặp trên máy tính của người dùng."
        },
        "correctAnswer": "C",
        "explanation": "Trích nguyên văn đáp án sách Hướng dẫn ôn thi tốt nghiệp môn Tin học (trang 178): 'C. Người làm nghề sửa chữa và bảo trì máy tính cần nắm vững cách cài đặt, điều chỉnh và tối ưu hoá các thông số cấu hình của hệ điều hành và phần mềm. Phương án A sai vì nghề này không đòi hỏi phải biết lập trình.'"
      },
      {
        "id": "12g-q2",
        "question": "Câu 2. Phát biểu nào sau đây mô tả đúng về nghề Quản trị mạng và hệ thống?",
        "options": {
          "A": "Kĩ thuật viên công nghệ thông tin là người phụ trách công việc Quản trị mạng và hệ thống.",
          "B": "Người Quản trị mạng và hệ thống nhất thiết phải lập trình thành thạo.",
          "C": "Để trở thành người Quản trị mạng và hệ thống cần phải được đào tạo một cách bài bản ở các bậc học tiếp theo.",
          "D": "Trong các văn bản pháp luật, không có nội dung nào liên quan đến công việc của người Quản trị mạng và hệ thống."
        },
        "correctAnswer": "C",
        "explanation": "Trích nguyên văn đáp án sách (trang 178): 'C. Để trở thành người Quản trị mạng và hệ thống cần có kiến thức chuyên sâu về hạ tầng mạng, giao thức và hệ điều hành mạng nên bắt buộc phải được đào tạo bài bản ở bậc cao đẳng, đại học.'"
      },
      {
        "id": "12g-q3",
        "question": "Câu 3. Phát biểu nào sau đây mô tả SAI về nghề Bảo mật hệ thống thông tin?",
        "options": {
          "A": "Nhu cầu nhân lực trong hiện tại và tương lai gần rất cao.",
          "B": "Nghề này chỉ làm việc khi hệ thống máy tính đã bị tin tặc tấn công thành công.",
          "C": "Có nhiệm vụ giám sát, phòng ngừa và ngăn chặn các cuộc tấn công mạng.",
          "D": "Được đào tạo qua các chuyên ngành như An toàn thông tin, An ninh mạng."
        },
        "correctAnswer": "B",
        "explanation": "Trích nguyên văn đáp án sách (trang 178): 'B. Phát biểu B sai vì chuyên viên bảo mật phải chủ động giám sát, rà soát lỗ hổng và triển khai biện pháp phòng vệ liên tục trước khi bị tấn công, chứ không phải đợi đến khi bị tấn công mới làm việc.'"
      }
    ],
    "application": {
      "realLife": "Học sinh yêu thích phần cứng và mạng máy tính có thể định hướng thi vào các ngành: An toàn thông tin, Kĩ thuật Mạng máy tính và Truyền thông, Khoa học máy tính tại các trường đại học.",
      "examTraps": [
        "Bẫy 1: Nghĩ rằng thợ sửa máy tính bắt buộc phải biết viết code lập trình (Sai, chủ yếu là kiến thức phần cứng và hệ điều hành).",
        "Bẫy 2: Cho rằng an ninh mạng chỉ là cài phần mềm diệt virus cá nhân."
      ],
      "tips": [
        "Nhớ rõ sự phân biệt: Sửa chữa phần cứng (Bảo trì) < Quản lý hệ thống máy chủ/mạng (Quản trị) < Phòng chống tấn công mã độc (Bảo mật)."
      ]
    },
    "requirements": [
      "Trình bày được đặc điểm nghề Sửa chữa và bảo trì máy tính.",
      "Mô tả được nghề Quản trị mạng và hệ thống.",
      "Nêu được vai trò nghề Bảo mật hệ thống thông tin."
    ],
    "keyConcepts": [
      {
        "term": "Quản trị mạng",
        "definition": "Vận hành, cấu hình, cấp quyền tài nguyên và xử lý sự cố kết nối trong mạng cơ quan.",
        "example": "Cấu hình VLAN trên Switch trường học."
      }
    ],
    "theorySections": [
      {
        "title": "1. Các ngành nghề tiêu biểu",
        "content": "• Sửa chữa bảo trì máy tính\\n• Quản trị mạng và hệ thống\\n• An toàn thông tin"
      }
    ],
    "practicalTips": [
      "Thuộc nhiệm vụ cốt lõi từng nghề."
    ],
    "commonPitfalls": [
      "Nhầm bảo trì máy tính với lập trình viên."
    ]
  },
  "11F": {
    "id": "11F",
    "code": "Chủ đề 11F",
    "title": "Giới thiệu các Hệ Cơ sở Dữ liệu & SQL",
    "grade": "11",
    "track": "ALL",
    "examWeight": "Cốt lõi Lớp 11 (~15% lệnh hỏi)",
    "iconName": "database",
    "summary": "Nắm vững khái niệm cơ sở dữ liệu (CSDL), hệ quản trị CSDL (DBMS), mô hình quan hệ, khoá chính, khoá ngoại, liên kết bảng và các câu lệnh truy vấn dữ liệu SQL tiêu chuẩn (SELECT, FROM, WHERE, ORDER BY, GROUP BY, HAVING, COUNT).",
    "outline": [
      {
        "id": "muc-tieu",
        "title": "Mục tiêu bài học",
        "level": 1
      },
      {
        "id": "muc-do",
        "title": "Mức độ kiến thức và kĩ năng cần đạt",
        "level": 1
      },
      {
        "id": "khoi-dong",
        "title": "Hoạt động khởi động",
        "level": 1
      },
      {
        "id": "sec-1",
        "title": "1. Khái niệm CSDL và Hệ quản trị CSDL (DBMS)",
        "level": 1
      },
      {
        "id": "sec-2",
        "title": "2. Mô hình CSDL quan hệ, Khoá chính và Khoá ngoại",
        "level": 1
      },
      {
        "id": "sec-3",
        "title": "3. Ngôn ngữ truy vấn có cấu trúc SQL",
        "level": 1
      },
      {
        "id": "ghi-nho",
        "title": "Ghi nhớ",
        "level": 1
      },
      {
        "id": "luyen-tap",
        "title": "Luyện tập (Trắc nghiệm chuẩn sách)",
        "level": 1
      },
      {
        "id": "van-dung",
        "title": "Vận dụng",
        "level": 1
      }
    ],
    "objectives": [
      "Phân biệt được dữ liệu, cơ sở dữ liệu (CSDL) và hệ quản trị cơ sở dữ liệu (DBMS).",
      "Hiểu và chỉ ra được các thành phần của mô hình CSDL quan hệ: bảng (quan hệ), hàng (bản ghi), cột (thuộc tính), trường dữ liệu.",
      "Xác định được vai trò của Khoá chính (Primary Key) và Khoá ngoại (Foreign Key) trong việc liên kết các bảng.",
      "Viết và đọc hiểu các câu lệnh truy vấn SQL cơ bản: SELECT, FROM, WHERE, ORDER BY, GROUP BY, HAVING, COUNT, SUM, AVG."
    ],
    "standards": [
      {
        "level": "Nhận biết",
        "desc": "Nêu được khái niệm CSDL và ví dụ về DBMS (MySQL, SQL Server, Access); nhận biết cú pháp SELECT FROM WHERE."
      },
      {
        "level": "Thông hiểu",
        "desc": "Giải thích được tính toàn vẹn dữ liệu nhờ khoá chính không trùng lặp; phân biệt WHERE (lọc từng hàng) và HAVING (lọc nhóm sau GROUP BY)."
      },
      {
        "level": "Vận dụng",
        "desc": "Viết câu lệnh SQL truy vấn danh sách học sinh đạt điểm giỏi, đếm số thí sinh trúng tuyển theo từng trường."
      }
    ],
    "warmUp": {
      "context": "Khi tra cứu điểm thi tốt nghiệp THPT trên mạng, hàng triệu thí sinh cùng truy cập một lúc nhưng hệ thống vẫn trả về chính xác điểm số của từng số báo danh chỉ trong vài phần trăm giây.",
      "question": "Dữ liệu điểm thi khổng lồ đó được lưu trữ và truy vấn như thế nào? Tại sao không dùng tệp Excel thông thường để quản lí?"
    },
    "mainSections": [
      {
        "id": "sec-1",
        "number": "1.",
        "title": "Khái niệm CSDL và Hệ quản trị CSDL (DBMS)",
        "content": "• Cơ sở dữ liệu (Database): Là tập hợp các dữ liệu có liên quan với nhau, được lưu trữ có cấu trúc trên bộ nhớ ngoài của máy tính nhằm đáp ứng nhu cầu khai thác thông tin của nhiều người dùng đồng thời.\\n• Hệ quản trị CSDL (DBMS - Database Management System): Là phần mềm chuyên dụng cung cấp môi trường để tạo lập, lưu trữ, cập nhật, truy xuất và bảo mật CSDL (ví dụ: Microsoft Access, MySQL, Microsoft SQL Server, Oracle, PostgreSQL)."
      },
      {
        "id": "sec-2",
        "number": "2.",
        "title": "Mô hình CSDL quan hệ, Khoá chính và Khoá ngoại",
        "content": "• Mô hình CSDL quan hệ (Relational Database): Dữ liệu được tổ chức dưới dạng các bảng 2 chiều (gọi là quan hệ - relation).\\n• Hàng (Row / Record / Bản ghi): Đại diện cho một đối tượng cụ thể (ví dụ: thông tin 1 học sinh).\\n• Cột (Column / Field / Thuộc tính): Đại diện cho một đặc tính của đối tượng (ví dụ: MaHS, HoTen, NgaySinh, DiemToan).\\n• Khoá chính (Primary Key): Là một hoặc nhiều trường dùng để định danh duy nhất mỗi bản ghi trong bảng. Giá trị khoá chính không được để trống (NOT NULL) và không được trùng lặp.\\n• Khoá ngoại (Foreign Key): Là trường trong bảng này đóng vai trò tham chiếu đến khoá chính của bảng khác, tạo nên mối quan hệ liên kết giữa các bảng."
      },
      {
        "id": "sec-3",
        "number": "3.",
        "title": "Ngôn ngữ truy vấn có cấu trúc SQL",
        "content": "SQL (Structured Query Language) là ngôn ngữ tiêu chuẩn để thao tác và truy xuất dữ liệu trong các hệ quản trị CSDL quan hệ.\\nCú pháp truy vấn tổng quát:\\nSELECT danh_sách_cột\\nFROM tên_bảng\\nWHERE điều_kiện_lọc\\nGROUP BY cột_nhóm\\nHAVING điều_kiện_nhóm\\nORDER BY cột_sắp_xếp ASC/DESC;\\n\\n• Các hàm gộp thông dụng: COUNT() đếm số bản ghi, SUM() tính tổng, AVG() tính trung bình, MAX(), MIN().",
        "codeSnippet": "-- Đếm số học sinh có kết quả 'Đỗ'\\nSELECT count(KetQua) \\nFROM DiemTHPT \\nWHERE KetQua = 'Đỗ';\\n\\n-- Lấy danh sách điểm thi ngày trong khoảng\\nSELECT * \\nFROM Sales \\nWHERE Date BETWEEN '2025-01-01' AND '2025-12-31';"
      }
    ],
    "memoryNotes": [
      "Khoá chính xác định duy nhất mỗi bản ghi, giá trị không được trùng lặp và không được rỗng.",
      "WHERE dùng để lọc từng bản ghi trước khi gộp nhóm; HAVING dùng để lọc nhóm sau lệnh GROUP BY.",
      "Cú pháp: SELECT (chọn cột) -> FROM (chọn bảng) -> WHERE (điều kiện) -> ORDER BY (sắp xếp)."
    ],
    "practiceQuestions": [
      {
        "id": "11f-q1",
        "question": "Câu 1. Bảng DiemTHPT có các cột SoBaoDanh, DiemToan, DiemLi, DiemHoa, TongDiem, KetQua. Hãy chọn câu lệnh SQL đếm tổng số thí sinh có kết quả 'Đỗ':",
        "options": {
          "A": "Select count(KetQua) From DiemTHPT Where KetQua = 'Đỗ'",
          "B": "Select count(KetQua) From DiemTHPT Order KetQua = 'Đỗ'",
          "C": "Select count(KetQua) From DiemTHPT Having KetQua = 'Đỗ'",
          "D": "Select count(KetQua) From DiemTHPT Where KetQua = 'TRƯỢT'"
        },
        "correctAnswer": "A",
        "explanation": "Trích nguyên văn đáp án sách Hướng dẫn ôn thi tốt nghiệp môn Tin học (trang 178): 'A. Dùng hàm COUNT() kết hợp mệnh đề WHERE để lọc các bản ghi có KetQua = \"Đỗ\". Phương án B sai vì dùng ORDER, phương án C sai vì dùng HAVING khi không có GROUP BY.'"
      },
      {
        "id": "11f-q2",
        "question": "Câu 2. Câu lệnh SQL nào sau đây viết ĐÚNG cú pháp toán tử so sánh?",
        "options": {
          "A": "SELECT * FROM Table1 WHERE Column1 => 10",
          "B": "SELECT * FROM Table1 WHERE Column1 == 10",
          "C": "SELECT * FROM Table1 WHERE Column1 >= 10",
          "D": "SELECT * FROM Table1 WHERE Column1 =< 10"
        },
        "correctAnswer": "C",
        "explanation": "Trích nguyên văn đáp án sách (trang 178): 'C. Trong chuẩn SQL, toán tử lớn hơn hoặc bằng viết là >=. Kí hiệu => hay =< đều là sai cú pháp.'"
      },
      {
        "id": "11f-q3",
        "question": "Câu 3. Bảng DIEM có các trường GIUA_KI, HOC_KI. Để tìm những học sinh có điểm giữa kì lớn hơn 3 VÀ điểm học kì lớn hơn 5, biểu thức điều kiện nào sau đây là đúng?",
        "options": {
          "A": "MOT_TIET => 3 AND HOC_KI > 5",
          "B": "[GIUA_KI] > 3 AND [HOC_KI] > 5",
          "C": "[MOT_TIET] > 3 OR [HOC_KI] > 5",
          "D": "[MOT_TIET] > \"3\" AND [HOC_KI] > \"5\""
        },
        "correctAnswer": "B",
        "explanation": "Trích nguyên văn đáp án sách (trang 179): 'B. Điều kiện đồng thời thỏa mãn cả hai tiêu chí dùng từ khóa AND, các trường số so sánh trực tiếp không để trong dấu ngoặc kép.'"
      }
    ],
    "application": {
      "realLife": "Ứng dụng trong quản lí học bạ điện tử VnEdu: mỗi học sinh có một mã định danh duy nhất (Khoá chính) để liên kết bảng Điểm, bảng Điểm danh và bảng Khen thưởng.",
      "examTraps": [
        "Bẫy 1: Dùng HAVING thay cho WHERE khi lọc dữ liệu không có gộp nhóm.",
        "Bẫy 2: Viết nhầm toán tử so sánh >= thành => trong câu lệnh SQL."
      ],
      "tips": [
        "Nhớ thứ tự các từ khoá SQL: SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ... ORDER BY."
      ]
    },
    "requirements": [
      "Phân biệt CSDL và DBMS.",
      "Hiểu mô hình CSDL quan hệ, khoá chính, khoá ngoại.",
      "Viết câu lệnh SQL truy vấn dữ liệu."
    ],
    "keyConcepts": [
      {
        "term": "Khoá chính (Primary Key)",
        "definition": "Định danh duy nhất mỗi bản ghi trong bảng, không được trùng lặp và không rỗng.",
        "example": "SoBaoDanh trong bảng Điểm thi."
      }
    ],
    "theorySections": [
      {
        "title": "1. Khái niệm cơ bản",
        "content": "CSDL quan hệ lưu dữ liệu dạng bảng. SQL là ngôn ngữ truy vấn tiêu chuẩn."
      }
    ],
    "practicalTips": [
      "Thuộc cú pháp SELECT FROM WHERE."
    ],
    "commonPitfalls": [
      "Nhầm HAVING với WHERE."
    ]
  },
  "11F_CS": {
    "id": "11F_CS",
    "code": "Chủ đề 11F-CS",
    "title": "Kĩ thuật Lập trình và Thuật toán",
    "grade": "11",
    "track": "CS",
    "examWeight": "Định hướng KHMT (~15% đề thi)",
    "iconName": "cpu",
    "summary": "Nắm vững mảng 1 chiều, mảng 2 chiều trong Python; thuật toán tìm kiếm tuần tự (Linear Search) và tìm kiếm nhị phân (Binary Search); các thuật toán sắp xếp (Bubble Sort, Insertion Sort, Selection Sort) và đánh giá độ phức tạp thuật toán O(n), O(log n), O(n^2).",
    "outline": [
      {
        "id": "muc-tieu",
        "title": "Mục tiêu bài học",
        "level": 1
      },
      {
        "id": "muc-do",
        "title": "Mức độ kiến thức và kĩ năng cần đạt",
        "level": 1
      },
      {
        "id": "khoi-dong",
        "title": "Hoạt động khởi động",
        "level": 1
      },
      {
        "id": "sec-1",
        "title": "1. Mảng một chiều và Mảng hai chiều trong Python",
        "level": 1
      },
      {
        "id": "sec-2",
        "title": "2. Thuật toán tìm kiếm tuần tự và Tìm kiếm nhị phân",
        "level": 1
      },
      {
        "id": "sec-3",
        "title": "3. Các thuật toán sắp xếp cơ bản (Nổi bọt, Chèn, Chọn)",
        "level": 1
      },
      {
        "id": "sec-4",
        "title": "4. Độ phức tạp thời gian của thuật toán",
        "level": 1
      },
      {
        "id": "ghi-nho",
        "title": "Ghi nhớ",
        "level": 1
      },
      {
        "id": "luyen-tap",
        "title": "Luyện tập (Trắc nghiệm chuẩn sách)",
        "level": 1
      },
      {
        "id": "van-dung",
        "title": "Vận dụng",
        "level": 1
      }
    ],
    "objectives": [
      "Sử dụng thành thạo cấu trúc danh sách (list) biểu diễn mảng 1 chiều và ma trận 2 chiều trong Python.",
      "Cài đặt và phân tích được thuật toán tìm kiếm tuần tự và tìm kiếm nhị phân (điều kiện mảng đã sắp xếp).",
      "Hiểu nguyên lí và cài đặt được 3 thuật toán sắp xếp: Sắp xếp nổi bọt (Bubble Sort), Sắp xếp chèn (Insertion Sort), Sắp xếp chọn (Selection Sort).",
      "Đánh giá và so sánh được độ phức tạp thuật toán qua kí hiệu Big-O trong trường hợp tốt nhất và xấu nhất."
    ],
    "standards": [
      {
        "level": "Nhận biết",
        "desc": "Nêu được điều kiện áp dụng tìm kiếm nhị phân (mảng phải được sắp xếp); nhận biết nguyên lí đổi chỗ 2 phần tử kề nhau của nổi bọt."
      },
      {
        "level": "Thông hiểu",
        "desc": "Giải thích được số vòng lặp và số bước so sánh của tìm kiếm nhị phân; hiểu vì sao độ phức tạp của tìm kiếm nhị phân là O(log n)."
      },
      {
        "level": "Vận dụng",
        "desc": "Viết mã nguồn Python giải bài toán tìm phần tử thoả mãn điều kiện; sắp xếp danh sách điểm thi học sinh theo thứ tự giảm dần."
      }
    ],
    "warmUp": {
      "context": "Khi tra một từ trong cuốn từ điển dày 1000 trang, em sẽ lật từng trang từ đầu đến cuối hay mở ngay vào giữa cuốn sách để thu hẹp phạm vi?",
      "question": "Cách mở vào giữa cuốn sách mô phỏng thuật toán tìm kiếm nào trong khoa học máy tính? Tại sao cách này lại nhanh hơn gấp nhiều lần?"
    },
    "mainSections": [
      {
        "id": "sec-1",
        "number": "1.",
        "title": "Mảng một chiều và Mảng hai chiều trong Python",
        "content": "• Mảng 1 chiều: Trong Python được biểu diễn bằng kiểu list, các phần tử đánh chỉ số từ 0 đến len(A)-1.\\n• Mảng 2 chiều (Ma trận): Danh sách các danh sách (list of lists). Phần tử ở hàng i, cột j truy cập qua cú pháp A[i][j].",
        "codeSnippet": "# Khởi tạo mảng 2 chiều kích thước 3x3 chứa toàn số 0\\nmatrix = [[0 for j in range(3)] for i in range(3)]"
      },
      {
        "id": "sec-2",
        "number": "2.",
        "title": "Thuật toán tìm kiếm tuần tự và Tìm kiếm nhị phân",
        "content": "• Tìm kiếm tuần tự (Linear Search): Duyệt tuần tự từ đầu mảng đến cuối mảng cho đến khi gặp phần tử cần tìm hoặc hết mảng. Áp dụng cho mọi mảng (không cần sắp xếp). Độ phức tạp: O(n).\\n• Tìm kiếm nhị phân (Binary Search): BẮT BUỘC danh sách phải được sắp xếp trước. Mỗi bước so sánh giá trị cần tìm với phần tử ở giữa (mid). Nếu nhỏ hơn thì tìm ở nửa trái, lớn hơn tìm ở nửa phải. Độ phức tạp cực nhanh: O(log n).",
        "codeSnippet": "def binary_search(A, x):\\n    left, right = 0, len(A) - 1\\n    while left <= right:\\n        mid = (left + right) // 2\\n        if A[mid] == x:\\n            return mid\\n        elif A[mid] < x:\\n            left = mid + 1\\n        else:\\n            right = mid - 1\\n    return -1"
      },
      {
        "id": "sec-3",
        "number": "3.",
        "title": "Các thuật toán sắp xếp cơ bản (Nổi bọt, Chèn, Chọn)",
        "content": "• Sắp xếp nổi bọt (Bubble Sort): So sánh liên tục 2 phần tử kề nhau, nếu đứng sai thứ tự thì đổi chỗ. Sau mỗi lượt duyệt, phần tử lớn nhất sẽ 'nổi' về cuối mảng.\\n• Sắp xếp chọn (Selection Sort): Tìm phần tử nhỏ nhất trong đoạn chưa sắp xếp rồi đổi chỗ nó về vị trí đầu tiên của đoạn đó.\\n• Sắp xếp chèn (Insertion Sort): Lấy lần lượt từng phần tử chèn vào đúng vị trí trong đoạn đã sắp xếp phía trước.",
        "codeSnippet": "def bubble_sort(arr):\\n    n = len(arr)\\n    for i in range(n - 1):\\n        for j in range(n - 1 - i):\\n            if arr[j] > arr[j + 1]:\\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\\n    return arr"
      },
      {
        "id": "sec-4",
        "number": "4.",
        "title": "Độ phức tạp thời gian của thuật toán",
        "content": "• O(1): Thời gian hằng số (truy cập mảng A[i]).\\n• O(log n): Rất nhanh (tìm kiếm nhị phân, chia để trị).\\n• O(n): Tuyến tính (tìm kiếm tuần tự, tìm max/min).\\n• O(n log n): Thuật toán sắp xếp tối ưu (Merge Sort, Quick Sort).\\n• O(n^2): Sắp xếp cơ bản (Bubble, Selection, Insertion Sort trong trường hợp xấu nhất)."
      }
    ],
    "memoryNotes": [
      "Điều kiện tiên quyết của tìm kiếm nhị phân: Mảng phải được sắp xếp trước.",
      "Tìm kiếm nhị phân có độ phức tạp O(log n); tìm kiếm tuần tự là O(n).",
      "Sắp xếp nổi bọt đổi chỗ 2 phần tử liền kề; sắp xếp chọn tìm phần tử nhỏ nhất đưa về đầu."
    ],
    "practiceQuestions": [
      {
        "id": "11fcs-q1",
        "question": "Câu 1. Thuật toán sắp xếp nổi bọt thực hiện sắp xếp dãy số không giảm bằng cách nào sau đây?",
        "options": {
          "A": "Đổi chỗ 2 số liền kề nhau nếu chúng đứng sai thứ tự cho đến khi dãy số được sắp xếp.",
          "B": "Di chuyển số nhỏ nhất về cuối danh sách.",
          "C": "Di chuyển số lớn nhất về đầu danh sách.",
          "D": "Chia mảng thành 2 nửa bằng nhau rồi gộp lại."
        },
        "correctAnswer": "A",
        "explanation": "Trích nguyên văn sách Hướng dẫn ôn thi tốt nghiệp môn Tin học (trang 87 & 180): 'A. Thuật toán sắp xếp nổi bọt so sánh cặp 2 phần tử kề nhau, nếu đứng sai thứ tự thì hoán đổi chỗ cho nhau.'"
      },
      {
        "id": "11fcs-q2",
        "question": "Câu 2. Để tìm kiếm phần tử bằng thuật toán tìm kiếm nhị phân, dãy số đầu vào bắt buộc phải thoả mãn điều kiện gì?",
        "options": {
          "A": "Dãy số phải có số lượng phần tử là số chẵn.",
          "B": "Dãy số phải được sắp xếp theo thứ tự tăng dần hoặc giảm dần.",
          "C": "Các phần tử trong dãy số đều phải là số nguyên dương.",
          "D": "Dãy số không được có bất kì phần tử nào trùng lặp."
        },
        "correctAnswer": "B",
        "explanation": "Trích nguyên văn đáp án sách (trang 180): 'B. Điều kiện bắt buộc của tìm kiếm nhị phân là dãy số phải được sắp xếp thứ tự trước để có thể so sánh giá trị phần tử giữa và loại bỏ một nửa không gian tìm kiếm ở mỗi bước.'"
      },
      {
        "id": "11fcs-q3",
        "question": "Câu 3. Thực hiện thuật toán tìm kiếm tuần tự để tìm số 10 trong danh sách [2, 6, 8, 4, 10, 12]. Đầu ra của thuật toán là thông báo nào?",
        "options": {
          "A": "'Không tìm thấy'.",
          "B": "'Tìm thấy'.",
          "C": "'Tìm thấy tại vị trí thứ 2'.",
          "D": "'Tìm thấy tại vị trí thứ 3'."
        },
        "correctAnswer": "B",
        "explanation": "Trích nguyên văn đáp án sách (trang 180): 'B. Số 10 có xuất hiện trong danh sách nên thuật toán trả về kết quả Tìm thấy.'"
      }
    ],
    "application": {
      "realLife": "Thuật toán tìm kiếm nhị phân là nền tảng của các chỉ mục cơ sở dữ liệu (B-Tree Index) và hệ thống tìm kiếm trong các tập đoàn công nghệ lớn.",
      "examTraps": [
        "Bẫy 1: Quên kiểm tra mảng đã sắp xếp hay chưa trước khi dùng Binary Search.",
        "Bẫy 2: Nhầm lẫn độ phức tạp O(log n) với O(n)."
      ],
      "tips": [
        "Học thuộc công thức vòng lặp Bubble Sort: cặp kề nhau arr[j] và arr[j+1].",
        "Công thức chỉ số giữa mid = (left + right) // 2."
      ]
    },
    "requirements": [
      "Sử dụng mảng 1 chiều, 2 chiều trong Python.",
      "Cài đặt thuật toán tìm kiếm tuần tự và nhị phân.",
      "Cài đặt thuật toán sắp xếp nổi bọt, chèn, chọn.",
      "Đánh giá độ phức tạp thời gian Big-O."
    ],
    "keyConcepts": [
      {
        "term": "Tìm kiếm nhị phân (Binary Search)",
        "definition": "Thuật toán tìm kiếm chia đôi trên mảng đã sắp xếp với độ phức tạp O(log n).",
        "example": "Tìm từ trong từ điển."
      }
    ],
    "theorySections": [
      {
        "title": "1. Thuật toán tìm kiếm",
        "content": "• Tuần tự: Duyệt từng phần tử O(n).\\n• Nhị phân: Chia đôi O(log n)."
      }
    ],
    "practicalTips": [
      "Nhớ điều kiện mảng sắp xếp."
    ],
    "commonPitfalls": [
      "Dùng nhị phân cho mảng chưa sắp xếp."
    ]
  },
  "12F_CS": {
    "id": "12F_CS",
    "code": "Chủ đề 12F-CS",
    "title": "Giới thiệu Học máy và Khoa học Dữ liệu",
    "grade": "12",
    "track": "CS",
    "examWeight": "Định hướng KHMT (~10% đề thi)",
    "iconName": "brain",
    "summary": "Tìm hiểu nền tảng của Học máy (Machine Learning) gồm học có giám sát, không giám sát, học tăng cường; quy trình 5 bước của Khoa học dữ liệu và ứng dụng trong phân tích dự đoán.",
    "outline": [
      {
        "id": "muc-tieu",
        "title": "Mục tiêu bài học",
        "level": 1
      },
      {
        "id": "muc-do",
        "title": "Mức độ kiến thức và kĩ năng cần đạt",
        "level": 1
      },
      {
        "id": "khoi-dong",
        "title": "Hoạt động khởi động",
        "level": 1
      },
      {
        "id": "sec-1",
        "title": "1. Khái niệm và Phân loại Học máy (Machine Learning)",
        "level": 1
      },
      {
        "id": "sec-2",
        "title": "2. Quy trình Khoa học Dữ liệu (Data Science Process)",
        "level": 1
      },
      {
        "id": "ghi-nho",
        "title": "Ghi nhớ",
        "level": 1
      },
      {
        "id": "luyen-tap",
        "title": "Luyện tập (Trắc nghiệm chuẩn sách)",
        "level": 1
      },
      {
        "id": "van-dung",
        "title": "Vận dụng",
        "level": 1
      }
    ],
    "objectives": [
      "Trình bày được khái niệm Học máy và 3 nhóm chính: Học có giám sát, Học không giám sát, Học tăng cường.",
      "Mô tả được các bước cơ bản trong quy trình khoa học dữ liệu: Thu thập -> Tiền xử lí -> Khám phá -> Xây dựng mô hình -> Đánh giá & Triển khai.",
      "Nêu được ví dụ ứng dụng của Học máy trong dự báo thời tiết, lọc thư rác và gợi ý mua sắm."
    ],
    "standards": [
      {
        "level": "Nhận biết",
        "desc": "Nêu được định nghĩa học máy và các nhóm học máy cơ bản."
      },
      {
        "level": "Thông hiểu",
        "desc": "Phân biệt được dữ liệu có nhãn (học có giám sát) và không có nhãn (học không giám sát)."
      },
      {
        "level": "Vận dụng",
        "desc": "Đề xuất bài toán ứng dụng học máy giải quyết vấn đề phân loại hình ảnh rác thải học đường."
      }
    ],
    "warmUp": {
      "context": "Khi bạn xem một video trên TikTok hoặc YouTube, hệ thống sẽ tự động đề xuất những video tiếp theo rất đúng với sở thích của bạn.",
      "question": "Thuật toán học máy đã làm thế nào để nắm bắt được sở thích của người dùng?"
    },
    "mainSections": [
      {
        "id": "sec-1",
        "number": "1.",
        "title": "Khái niệm và Phân loại Học máy (Machine Learning)",
        "content": "Học máy là một nhánh của Trí tuệ nhân tạo, nghiên cứu các thuật toán giúp máy tính tự động học hỏi từ dữ liệu quá khứ để đưa ra dự đoán hoặc quyết định mà không cần lập trình quy tắc tường minh.\\n• Học có giám sát (Supervised Learning): Dữ liệu huấn luyện có kèm nhãn đáp án (Label). Ví dụ: Phân loại email là 'Thư rác' hoặc 'Hợp lệ'.\\n• Học không giám sát (Unsupervised Learning): Dữ liệu không có nhãn, mô hình tự tìm ra cấu trúc ẩn hoặc gom nhóm (Clustering). Ví dụ: Phân nhóm khách hàng theo hành vi mua sắm.\\n• Học tăng cường (Reinforcement Learning): Mô hình học thông qua tương tác thử - sai với môi trường để nhận phần thưởng (Reward) hoặc hình phạt. Ví dụ: Huấn luyện robot di chuyển, chơi cờ AlphaGo."
      },
      {
        "id": "sec-2",
        "number": "2.",
        "title": "Quy trình Khoa học Dữ liệu",
        "content": "Gồm 5 bước chuẩn:\\n1. Thu thập dữ liệu: Từ cảm biến, tệp log, cơ sở dữ liệu hoặc khảo sát.\\n2. Tiền xử lí dữ liệu: Làm sạch dữ liệu, xử lí giá trị thiếu (missing values), loại bỏ dữ liệu ngoại lai và chuẩn hoá số liệu.\\n3. Khám phá dữ liệu (EDA): Trực quan hoá bằng biểu đồ để tìm ra xu hướng.\\n4. Huấn luyện mô hình: Chọn thuật toán học máy phù hợp.\\n5. Đánh giá và triển khai: Kiểm thử trên dữ liệu mới và đưa vào ứng dụng thực tế."
      }
    ],
    "memoryNotes": [
      "Học có giám sát dùng dữ liệu có nhãn; học không giám sát dùng dữ liệu không có nhãn.",
      "Học tăng cường dựa trên cơ chế thưởng - phạt khi tương tác với môi trường.",
      "Làm sạch và tiền xử lí dữ liệu chiếm tới 70-80% thời gian của một dự án khoa học dữ liệu."
    ],
    "practiceQuestions": [
      {
        "id": "12fcs-q1",
        "question": "Câu 1. Phương pháp học máy nào sử dụng dữ liệu huấn luyện đã được gán nhãn (label)?",
        "options": {
          "A": "Học không giám sát.",
          "B": "Học có giám sát.",
          "C": "Học tăng cường.",
          "D": "Học tự do."
        },
        "correctAnswer": "B",
        "explanation": "Trích nguyên văn đáp án sách (trang 179): 'B. Học có giám sát (Supervised Learning) là phương pháp học máy mà tập dữ liệu huấn luyện đã có sẵn cả đầu vào và nhãn kết quả mong muốn.'"
      }
    ],
    "application": {
      "realLife": "Ứng dụng trong y tế: Mô hình phân loại khối u lành tính hay ác tính dựa trên hình ảnh chụp cắt lớp đã được bác sĩ gán nhãn.",
      "examTraps": [
        "Nhầm lẫn giữa học có giám sát và học không giám sát."
      ],
      "tips": [
        "Nhớ từ khoá 'có nhãn' là có giám sát, 'gom cụm không nhãn' là không giám sát."
      ]
    },
    "requirements": [
      "Hiểu khái niệm học máy.",
      "Phân biệt học có giám sát và không giám sát."
    ],
    "keyConcepts": [
      {
        "term": "Học có giám sát",
        "definition": "Học từ dữ liệu có nhãn."
      }
    ],
    "theorySections": [
      {
        "title": "1. Khái niệm",
        "content": "Học máy giúp máy tính tự học từ dữ liệu."
      }
    ],
    "practicalTips": [
      "Thuộc các nhóm học máy."
    ],
    "commonPitfalls": [
      "Nhầm học máy với CSDL."
    ]
  },
  "12E_ICT": {
    "id": "12E_ICT",
    "code": "Chủ đề 12E-ICT",
    "title": "Thực hành Phần mềm Tạo Trang Web",
    "grade": "12",
    "track": "ICT",
    "examWeight": "Định hướng THUD (~15% đề thi)",
    "iconName": "globe",
    "summary": "Sử dụng các phần mềm tạo trang web trực quan (như Google Sites, phần mềm CMS) để thiết kế website hoàn chỉnh: tạo thanh điều hướng (Navigation bar), chèn khối nội dung, văn bản, ảnh, nhúng video YouTube, biểu mẫu liên hệ và xuất bản lên Internet.",
    "outline": [
      {
        "id": "muc-tieu",
        "title": "Mục tiêu bài học",
        "level": 1
      },
      {
        "id": "muc-do",
        "title": "Mức độ kiến thức và kĩ năng cần đạt",
        "level": 1
      },
      {
        "id": "khoi-dong",
        "title": "Hoạt động khởi động",
        "level": 1
      },
      {
        "id": "sec-1",
        "title": "1. Quy trình thiết kế website trực quan",
        "level": 1
      },
      {
        "id": "sec-2",
        "title": "2. Tạo cấu trúc trang và thanh điều hướng",
        "level": 1
      },
      {
        "id": "sec-3",
        "title": "3. Nhúng đa phương tiện và Xuất bản trang web",
        "level": 1
      },
      {
        "id": "ghi-nho",
        "title": "Ghi nhớ",
        "level": 1
      },
      {
        "id": "luyen-tap",
        "title": "Luyện tập (Trắc nghiệm chuẩn sách)",
        "level": 1
      },
      {
        "id": "van-dung",
        "title": "Vận dụng",
        "level": 1
      }
    ],
    "objectives": [
      "Sử dụng thành thạo phần mềm thiết kế website trực quan để tạo trang web tin tức hoặc giới thiệu câu lạc bộ.",
      "Tạo được hệ thống trang phân cấp: Trang chủ (Home), Trang con và thanh điều hướng (Navigation Menu).",
      "Chèn và định dạng nội dung đa phương tiện: văn bản, hình ảnh, băng chuyền ảnh (Carousel), video nhúng YouTube.",
      "Thiết lập tên miền phụ và xuất bản (Publish) trang web công khai trên môi trường Internet."
    ],
    "standards": [
      {
        "level": "Nhận biết",
        "desc": "Nêu được các bước cơ bản để tạo trang web bằng phần mềm trực quan."
      },
      {
        "level": "Thông hiểu",
        "desc": "Hiểu cách tổ chức cấu trúc menu điều hướng trang web khoa học và thân thiện với người dùng."
      },
      {
        "level": "Vận dụng",
        "desc": "Hoàn thiện một trang web giới thiệu đặc sản quê hương với đầy đủ hình ảnh, video và bản đồ Google Maps."
      }
    ],
    "warmUp": {
      "context": "Nhóm của em được phân công làm một trang web giới thiệu dự án bảo vệ môi trường của trường trong vòng 2 ngày.",
      "question": "Thay vì gõ từng dòng mã HTML/CSS phức tạp, có công cụ nào giúp các em kéo thả để hoàn thành trang web nhanh chóng và chuyên nghiệp không?"
    },
    "mainSections": [
      {
        "id": "sec-1",
        "number": "1.",
        "title": "Quy trình thiết kế website trực quan",
        "content": "• Bước 1: Xác định mục tiêu và đối tượng phục vụ của trang web.\\n• Bước 2: Phác thảo sơ đồ cấu trúc trang (Sitemap) gồm trang chủ và các trang thành phần.\\n• Bước 3: Thu thập và chuẩn bị tài liệu (logo, bài viết, hình ảnh độ phân giải cao, video tư liệu).\\n• Bước 4: Tạo lập giao diện bằng phần mềm tạo web (như Google Sites).\\n• Bước 5: Kiểm thử hiển thị trên các màn hình máy tính, máy tính bảng và điện thoại di động.\\n• Bước 6: Xuất bản (Publish) và chia sẻ liên kết."
      },
      {
        "id": "sec-2",
        "number": "2.",
        "title": "Tạo cấu trúc trang và thanh điều hướng",
        "content": "Thanh điều hướng (Navigation Bar) là thành phần sống còn giúp người xem di chuyển giữa các trang con. Cần sắp xếp danh mục ngắn gọn, rõ ràng theo thứ bậc hợp lí."
      },
      {
        "id": "sec-3",
        "number": "3.",
        "title": "Nhúng đa phương tiện và Xuất bản trang web",
        "content": "• Nhúng video: Khuyến nghị tải video lên YouTube rồi nhúng bằng mã hoặc đường link URL để tiết kiệm dung lượng lưu trữ của máy chủ web.\\n• Xuất bản: Nhấn nút Publish, đặt tên địa chỉ web (web address) hợp lệ, thiết lập quyền xem công khai (Public)."
      }
    ],
    "memoryNotes": [
      "Nhúng video YouTube giúp tiết kiệm băng thông máy chủ và đảm bảo phát mượt mà trên mọi thiết bị.",
      "Thanh điều hướng cần đặt ở vị trí dễ thấy (đầu trang hoặc cạnh trái).",
      "Luôn kiểm tra quyền riêng tư (Sharing settings) trước khi gửi link cho mọi người."
    ],
    "practiceQuestions": [
      {
        "id": "12eict-q1",
        "question": "Câu 1. Khi thiết kế trang web bằng phần mềm trực quan, cách làm nào sau đây là TỐI ƯU NHẤT để chèn video vào trang web?",
        "options": {
          "A": "Tải video lên YouTube rồi chèn đối tượng nhúng video từ YouTube vào trang web.",
          "B": "Tải video trực tiếp từ máy tính lên trang web để lưu trữ cục bộ.",
          "C": "Chuyển video thành ảnh động GIF rồi chèn vào trang web.",
          "D": "Không thể chèn video vào trang web thiết kế trực quan."
        },
        "correctAnswer": "A",
        "explanation": "Trích nguyên văn đáp án sách Hướng dẫn ôn thi tốt nghiệp môn Tin học (trang 183): 'A. Đăng video lên YouTube rồi thêm video vào trang web thông qua đối tượng nhúng video giúp tối ưu hoá dung lượng lưu trữ và tốc độ tải trang web.'"
      }
    ],
    "application": {
      "realLife": "Tự tạo trang web portfolio cá nhân bằng Google Sites để lưu trữ các chứng chỉ, dự án học tập và hồ sơ xét tuyển đại học.",
      "examTraps": [
        "Cho rằng phải tự lưu video 4K trên hosting của mình mới xem được."
      ],
      "tips": [
        "Nhớ ưu điểm vượt trội của việc nhúng liên kết YouTube."
      ]
    },
    "requirements": [
      "Sử dụng phần mềm tạo web trực quan.",
      "Xuất bản website lên Internet."
    ],
    "keyConcepts": [
      {
        "term": "Phần mềm tạo web trực quan",
        "definition": "Công cụ thiết kế web kéo thả không cần viết code."
      }
    ],
    "theorySections": [
      {
        "title": "1. Thực hành",
        "content": "Kéo thả layout, nhúng ảnh và video."
      }
    ],
    "practicalTips": [
      "Nhúng video qua YouTube."
    ],
    "commonPitfalls": [
      "Quên xuất bản (Publish) trang web."
    ]
  },
  "11E_ICT": {
    "id": "11E_ICT",
    "code": "Chủ đề 11E-ICT",
    "title": "Thực hành Tạo và Khai thác Cơ sở Dữ liệu",
    "grade": "11",
    "track": "ICT",
    "examWeight": "Định hướng THUD (~15% đề thi)",
    "iconName": "server",
    "summary": "Thực hành tạo lập bảng, khai báo trường, kiểu dữ liệu, thiết lập khoá chính, tạo mối liên kết giữa các bảng, thiết kế biểu mẫu nhập liệu (Form), xây dựng mẫu hỏi truy vấn (Query) và tạo báo cáo tổng hợp (Report) trên hệ quản trị CSDL quan hệ.",
    "outline": [
      {
        "id": "muc-tieu",
        "title": "Mục tiêu bài học",
        "level": 1
      },
      {
        "id": "muc-do",
        "title": "Mức độ kiến thức và kĩ năng cần đạt",
        "level": 1
      },
      {
        "id": "khoi-dong",
        "title": "Hoạt động khởi động",
        "level": 1
      },
      {
        "id": "sec-1",
        "title": "1. Tạo cấu trúc bảng và Thiết lập Khoá chính",
        "level": 1
      },
      {
        "id": "sec-2",
        "title": "2. Tạo liên kết giữa các bảng",
        "level": 1
      },
      {
        "id": "sec-3",
        "title": "3. Tạo Mẫu hỏi truy vấn (Query) và Báo cáo (Report)",
        "level": 1
      },
      {
        "id": "ghi-nho",
        "title": "Ghi nhớ",
        "level": 1
      },
      {
        "id": "luyen-tap",
        "title": "Luyện tập (Trắc nghiệm chuẩn sách)",
        "level": 1
      },
      {
        "id": "van-dung",
        "title": "Vận dụng",
        "level": 1
      }
    ],
    "objectives": [
      "Tạo được các bảng CSDL với các kiểu dữ liệu thích hợp (Short Text, Number, Date/Time, AutoNumber, Yes/No).",
      "Chỉ định được khoá chính cho bảng dữ liệu.",
      "Thiết lập được mối liên kết giữa các bảng (1 - Nhiều) và bật tính toàn vẹn tham chiếu.",
      "Tạo được các câu truy vấn Query lọc dữ liệu có điều kiện và tạo báo cáo Report in ấn."
    ],
    "standards": [
      {
        "level": "Nhận biết",
        "desc": "Nêu được các đối tượng chính trong CSDL: Table, Query, Form, Report."
      },
      {
        "level": "Thông hiểu",
        "desc": "Hiểu sự cần thiết của việc liên kết các bảng để tránh dư thừa và nhất quán dữ liệu."
      },
      {
        "level": "Vận dụng",
        "desc": "Xây dựng CSDL Quản lí thư viện trường học gồm bảng Sách, bảng Độc giả và bảng Mượn trả."
      }
    ],
    "warmUp": {
      "context": "Khi đến thư viện mượn sách, thủ thư chỉ cần quét mã thẻ học sinh và mã cuốn sách thì thông tin ngày mượn, hạn trả lập tức được ghi nhận.",
      "question": "Các bảng Sách và bảng Bạn đọc được liên kết với nhau như thế nào trong phần mềm quản lí thư viện?"
    },
    "mainSections": [
      {
        "id": "sec-1",
        "number": "1.",
        "title": "Tạo cấu trúc bảng và Thiết lập Khoá chính",
        "content": "• Table (Bảng): Đối tượng cơ sở lưu trữ dữ liệu.\\n• Khai báo trường (Field Name), kiểu dữ liệu (Data Type) và mô tả (Description).\\n• Thiết lập Khoá chính: Chọn trường định danh duy nhất (ví dụ: MaSach, MaHS), nhấn biểu tượng chiếc chìa khoá (Primary Key)."
      },
      {
        "id": "sec-2",
        "number": "2.",
        "title": "Tạo liên kết giữa các bảng",
        "content": "Kéo thả trường khoá chính từ bảng cha sang trường khoá ngoại của bảng con trong cửa sổ Relationships. Bật tính năng 'Enforce Referential Integrity' (ràng buộc toàn vẹn tham chiếu) để ngăn chặn việc nhập mã không tồn tại."
      },
      {
        "id": "sec-3",
        "number": "3.",
        "title": "Tạo Mẫu hỏi truy vấn (Query) và Báo cáo (Report)",
        "content": "• Query (Mẫu hỏi): Lọc, sắp xếp, kết xuất dữ liệu từ một hoặc nhiều bảng thoả mãn điều kiện (Criteria).\\n• Form (Biểu mẫu): Tạo giao diện thuận tiện cho người dùng nhập liệu.\\n• Report (Báo cáo): Định dạng và tổng hợp dữ liệu để in ra giấy hoặc xuất bản tệp PDF."
      }
    ],
    "memoryNotes": [
      "4 đối tượng chính trong Access/DBMS: Table (Bảng), Query (Mẫu hỏi), Form (Biểu mẫu), Report (Báo cáo).",
      "Ràng buộc toàn vẹn tham chiếu đảm bảo không thể xoá bản ghi cha khi bản ghi con đang tham chiếu tới.",
      "Query dùng để tính toán và lọc dữ liệu; Report dùng để kết xuất in ấn."
    ],
    "practiceQuestions": [
      {
        "id": "11eict-q1",
        "question": "Câu 1. Trong hệ quản trị CSDL, đối tượng nào được thiết kế chuyên biệt để định dạng, tính toán tổng hợp và kết xuất dữ liệu phục vụ in ấn?",
        "options": {
          "A": "Table (Bảng).",
          "B": "Query (Mẫu hỏi).",
          "C": "Report (Báo cáo).",
          "D": "Form (Biểu mẫu)."
        },
        "correctAnswer": "C",
        "explanation": "Trích nguyên văn đáp án sách Hướng dẫn ôn thi tốt nghiệp môn Tin học (trang 185): 'C. Report (Báo cáo) là đối tượng chuyên dùng để tổng hợp, trình bày số liệu theo nhóm và định dạng bố cục phục vụ in ấn.'"
      }
    ],
    "application": {
      "realLife": "Xây dựng hệ thống quản lí điểm thi thử tốt nghiệp THPT của trường gồm bảng HocSinh, bảng MonThi và bảng KetQuaThi.",
      "examTraps": [
        "Nhầm lẫn giữa mục đích của Form (nhập liệu) với Report (in ấn)."
      ],
      "tips": [
        "Nhớ 4 đối tượng: Bảng lưu, Form nhập, Query lọc, Report in."
      ]
    },
    "requirements": [
      "Tạo bảng và khoá chính.",
      "Tạo quan hệ giữa các bảng.",
      "Tạo Query và Report."
    ],
    "keyConcepts": [
      {
        "term": "Report (Báo cáo)",
        "definition": "Đối tượng định dạng và in ấn dữ liệu."
      }
    ],
    "theorySections": [
      {
        "title": "1. Khai thác CSDL",
        "content": "Tạo Table, Query, Form, Report."
      }
    ],
    "practicalTips": [
      "Nhớ vai trò từng đối tượng."
    ],
    "commonPitfalls": [
      "Nhầm Form với Report."
    ]
  },
  "10_PYTHON": {
    "id": "10_PYTHON",
    "code": "Chủ đề 10-PY",
    "title": "Lập trình Python Cơ bản",
    "grade": "10",
    "track": "ALL",
    "examWeight": "Nền tảng Lớp 10 (~10% lệnh hỏi)",
    "iconName": "terminal",
    "summary": "Nắm vững cú pháp ngôn ngữ lập trình Python: các kiểu dữ liệu chuẩn (int, float, str, bool), toán tử, cấu trúc rẽ nhánh if - elif - else, cấu trúc lặp for và while, xử lí chuỗi và định nghĩa hàm def.",
    "outline": [
      {
        "id": "muc-tieu",
        "title": "Mục tiêu bài học",
        "level": 1
      },
      {
        "id": "muc-do",
        "title": "Mức độ kiến thức và kĩ năng cần đạt",
        "level": 1
      },
      {
        "id": "khoi-dong",
        "title": "Hoạt động khởi động",
        "level": 1
      },
      {
        "id": "sec-1",
        "title": "1. Kiểu dữ liệu và Các phép toán cơ bản",
        "level": 1
      },
      {
        "id": "sec-2",
        "title": "2. Cấu trúc rẽ nhánh if - else",
        "level": 1
      },
      {
        "id": "sec-3",
        "title": "3. Cấu trúc lặp for và while",
        "level": 1
      },
      {
        "id": "sec-4",
        "title": "4. Định nghĩa và Sử dụng Hàm (Function)",
        "level": 1
      },
      {
        "id": "ghi-nho",
        "title": "Ghi nhớ",
        "level": 1
      },
      {
        "id": "luyen-tap",
        "title": "Luyện tập (Trắc nghiệm chuẩn sách)",
        "level": 1
      },
      {
        "id": "van-dung",
        "title": "Vận dụng",
        "level": 1
      }
    ],
    "objectives": [
      "Nhận biết và chuyển đổi giữa các kiểu dữ liệu cơ bản: int, float, str, bool.",
      "Sử dụng đúng các phép toán số học: chia lấy nguyên //, chia lấy dư %, luỹ thừa **.",
      "Viết thành thạo cấu trúc rẽ nhánh if - elif - else.",
      "Viết thành thạo cấu trúc lặp với số lần biết trước for i in range(...) và lặp điều kiện while.",
      "Khai báo hàm có tham số và giá trị trả về với từ khoá def và return."
    ],
    "standards": [
      {
        "level": "Nhận biết",
        "desc": "Nhận biết quy tắc đặt tên biến trong Python; phân biệt toán tử chia thực / và chia nguyên //."
      },
      {
        "level": "Thông hiểu",
        "desc": "Theo dõi được giá trị biến qua các bước lặp; hiểu cách thức hoạt động của range(start, stop, step)."
      },
      {
        "level": "Vận dụng",
        "desc": "Viết chương trình kiểm tra số nguyên tố, tính tổng các chữ số của một số tự nhiên."
      }
    ],
    "warmUp": {
      "context": "Python là ngôn ngữ lập trình phổ biến hàng đầu thế giới được sử dụng trong Trí tuệ nhân tạo, phân tích dữ liệu và phát triển web nhờ cú pháp cực kì sáng sủa và dễ học.",
      "question": "Tại sao một đoạn mã Python thường ngắn hơn 2 đến 3 lần so với mã C++ hay Java tương đương?"
    },
    "mainSections": [
      {
        "id": "sec-1",
        "number": "1.",
        "title": "Kiểu dữ liệu và Các phép toán cơ bản",
        "content": "• Các kiểu dữ liệu: int (số nguyên), float (số thực), str (chuỗi kí tự), bool (đúng/sai True/False).\\n• Phép toán số học: + (cộng), - (trừ), * (nhân), / (chia ra số thực), // (chia lấy phần nguyên), % (chia lấy phần dư), ** (luỹ thừa).\\nVí dụ: 17 // 5 = 3; 17 % 5 = 2; 2 ** 3 = 8.\\n• Hàm nhập xuất: print() in ra màn hình, input() nhận chuỗi văn bản từ bàn phím. Ép kiểu: int(input()), float(input())."
      },
      {
        "id": "sec-2",
        "number": "2.",
        "title": "Cấu trúc rẽ nhánh if - else",
        "content": "Python sử dụng thụt đầu dòng (indentation, thường là 4 dấu cách) để xác định khối lệnh thay cho cặp ngoặc nhọn { }.",
        "codeSnippet": "dtb = float(input(\\\"Nhập điểm trung bình: \\\"))\\nif dtb >= 8.0:\\n    print(\\\"Học lực Giỏi\\\")\\nelif dtb >= 6.5:\\n    print(\\\"Học lực Khá\\\")\\nelse:\\n    print(\\\"Học lực Trung bình\\\")"
      },
      {
        "id": "sec-3",
        "number": "3.",
        "title": "Cấu trúc lặp for và while",
        "content": "• Lệnh lặp for: for i in range(start, stop, step): Lặp biến i từ start đến stop - 1.\\n• Lệnh lặp while: while điều_kiện: Tiếp tục lặp khi điều kiện còn True.\\n• Lệnh break thoát vòng lặp ngay lập tức; lệnh continue bỏ qua lần lặp hiện tại."
      },
      {
        "id": "sec-4",
        "number": "4.",
        "title": "Định nghĩa và Sử dụng Hàm (Function)",
        "content": "Hàm giúp chia nhỏ chương trình thành các khối chức năng tái sử dụng được, tránh lặp lại mã nguồn.",
        "codeSnippet": "def tinh_tong(a, b):\\n    return a + b\\n\\nket_qua = tinh_tong(15, 25)\\nprint(ket_qua) # In ra 40"
      }
    ],
    "memoryNotes": [
      "Hàm range(n) sinh dãy số từ 0 đến n - 1 (gồm đúng n số).",
      "Phép chia // lấy phần nguyên; % lấy phần dư; ** là luỹ thừa.",
      "Quy tắc thụt đầu dòng (Indentation) trong Python là bắt buộc, không được tuỳ tiện."
    ],
    "practiceQuestions": [
      {
        "id": "10py-q1",
        "question": "Câu 1. Trong Python, kết quả của biểu thức 19 // 4 và 19 % 4 lần lượt là:",
        "options": {
          "A": "4 và 3",
          "B": "4.75 và 3",
          "C": "4 và 4",
          "D": "3 và 4"
        },
        "correctAnswer": "A",
        "explanation": "19 chia 4 được 4 dư 3. Phép // lấy phần nguyên trả về 4, phép % lấy phần dư trả về 3."
      },
      {
        "id": "10py-q2",
        "question": "Câu 2. Vòng lặp for i in range(2, 8, 2) sẽ thực hiện bao nhiêu lần lặp và duyệt qua các giá trị nào của i?",
        "options": {
          "A": "3 lần lặp, qua các giá trị 2, 4, 6.",
          "B": "4 lần lặp, qua các giá trị 2, 4, 6, 8.",
          "C": "3 lần lặp, qua các giá trị 2, 5, 8.",
          "D": "6 lần lặp, qua các giá trị từ 2 đến 7."
        },
        "correctAnswer": "A",
        "explanation": "Hàm range(2, 8, 2) bắt đầu từ 2, dừng trước 8 và bước nhảy là 2 => các giá trị sinh ra là 2, 4, 6 (tổng cộng 3 lần lặp)."
      }
    ],
    "application": {
      "realLife": "Tự động hoá các tác vụ tính toán hàng ngày như tính chỉ số BMI, đổi tiền tệ, tính lãi suất ngân hàng.",
      "examTraps": [
        "Quên rằng range(start, stop) không bao gồm giá trị stop."
      ],
      "tips": [
        "Nhớ // là chia nguyên, % là chia dư, ** là luỹ thừa."
      ]
    },
    "requirements": [
      "Biết kiểu dữ liệu và toán tử.",
      "Sử dụng if-else, for, while, def."
    ],
    "keyConcepts": [
      {
        "term": "Indentation",
        "definition": "Quy tắc thụt lề bắt buộc trong Python."
      }
    ],
    "theorySections": [
      {
        "title": "1. Python cơ bản",
        "content": "Cú pháp, biến, vòng lặp và hàm."
      }
    ],
    "practicalTips": [
      "Thuộc range(a, b, step)."
    ],
    "commonPitfalls": [
      "Quên dấu hai chấm sau if/for/def."
    ]
  }
};
