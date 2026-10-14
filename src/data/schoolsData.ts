import { School } from '../types';

export const PROVINCE_NAME = 'Quảng Ngãi';

export const QUANG_NGAI_DISTRICTS = [
  'TP. Quảng Ngãi',
  'Huyện Bình Sơn',
  'Huyện Sơn Tịnh',
  'Huyện Tư Nghĩa',
  'Huyện Nghĩa Hành',
  'Huyện Mộ Đức',
  'Thị xã Đức Phổ',
  'Huyện Lý Sơn',
  'Huyện Minh Long',
  'Huyện Sơn Hà',
  'Huyện Trà Bồng',
  'Huyện Sơn Tây',
  'Huyện Ba Tơ',
  'Huyện Tây Trà'
];

export const QUANG_NGAI_SCHOOLS: School[] = [
  // TP. Quảng Ngãi
  {
    id: 'qn_le_khiet',
    name: 'THPT chuyên Lê Khiết',
    district: 'TP. Quảng Ngãi',
    address: 'Số 10 đường Nguyễn Thông, Phường Nghĩa Lộ, TP. Quảng Ngãi'
  },
  {
    id: 'qn_tran_quoc_tuan',
    name: 'THPT Trần Quốc Tuấn',
    district: 'TP. Quảng Ngãi',
    address: 'Phường Nguyễn Nghiêm, TP. Quảng Ngãi'
  },
  {
    id: 'qn_vo_nguyen_giap',
    name: 'THPT Võ Nguyên Giáp',
    district: 'TP. Quảng Ngãi',
    address: 'Phường Trương Quang Trọng, TP. Quảng Ngãi'
  },
  {
    id: 'qn_huynh_thuc_khang',
    name: 'THPT Huỳnh Thúc Kháng',
    district: 'TP. Quảng Ngãi',
    address: 'Phường Trương Quang Trọng, TP. Quảng Ngãi'
  },
  {
    id: 'qn_le_trung_dinh',
    name: 'THPT Lê Trung Đình',
    district: 'TP. Quảng Ngãi',
    address: 'Phường Trần Hưng Đạo, TP. Quảng Ngãi'
  },
  {
    id: 'qn_son_my',
    name: 'THPT Sơn Mỹ',
    district: 'TP. Quảng Ngãi',
    address: 'Xã Tịnh Khê, TP. Quảng Ngãi'
  },
  {
    id: 'qn_ptdtnt',
    name: 'PTDTNT THPT Tỉnh Quảng Ngãi',
    district: 'TP. Quảng Ngãi',
    address: 'Số 10 đường Nguyễn Thông, Phường Nghĩa Lộ, TP. Quảng Ngãi'
  },

  // Huyện Bình Sơn
  {
    id: 'bs_binh_son',
    name: 'THPT Bình Sơn',
    district: 'Huyện Bình Sơn',
    address: 'Thị trấn Châu Ổ, Huyện Bình Sơn'
  },
  {
    id: 'bs_tran_ky_phong',
    name: 'THPT Trần Kỳ Phong',
    district: 'Huyện Bình Sơn',
    address: 'Xã Bình Nguyên, Huyện Bình Sơn'
  },
  {
    id: 'bs_le_quy_don',
    name: 'THPT Lê Quý Đôn',
    district: 'Huyện Bình Sơn',
    address: 'Xã Bình Trung, Huyện Bình Sơn'
  },
  {
    id: 'bs_van_tuong',
    name: 'THCS & THPT Vạn Tường',
    district: 'Huyện Bình Sơn',
    address: 'Xã Bình Tân Phú, Huyện Bình Sơn'
  },

  // Huyện Sơn Tịnh
  {
    id: 'st_ba_gia',
    name: 'THPT Ba Gia',
    district: 'Huyện Sơn Tịnh',
    address: 'Xã Tịnh Bắc, Huyện Sơn Tịnh'
  },
  {
    id: 'st_son_tinh_1',
    name: 'THPT Sơn Tịnh 1',
    district: 'Huyện Sơn Tịnh',
    address: 'Xã Tịnh Hà, Huyện Sơn Tịnh'
  },

  // Huyện Tư Nghĩa
  {
    id: 'tn_so_1',
    name: 'THPT Số 1 Tư Nghĩa',
    district: 'Huyện Tư Nghĩa',
    address: 'Thị trấn Sông Vệ, Huyện Tư Nghĩa'
  },
  {
    id: 'tn_so_2',
    name: 'THPT Số 2 Tư Nghĩa',
    district: 'Huyện Tư Nghĩa',
    address: 'Xã Nghĩa Lâm, Huyện Tư Nghĩa'
  },
  {
    id: 'tn_chu_van_an',
    name: 'THPT Chu Văn An',
    district: 'Huyện Tư Nghĩa',
    address: 'Thị trấn La Hà, Huyện Tư Nghĩa'
  },
  {
    id: 'tn_thu_xa',
    name: 'THPT Thu Xà',
    district: 'Huyện Tư Nghĩa',
    address: 'Xã Nghĩa Hòa, Huyện Tư Nghĩa'
  },

  // Huyện Nghĩa Hành
  {
    id: 'nh_so_1',
    name: 'THPT Số 1 Nghĩa Hành',
    district: 'Huyện Nghĩa Hành',
    address: 'Thị trấn Chợ Chùa, Huyện Nghĩa Hành'
  },
  {
    id: 'nh_so_2',
    name: 'THPT Số 2 Nghĩa Hành',
    district: 'Huyện Nghĩa Hành',
    address: 'Xã Hành Minh, Huyện Nghĩa Hành'
  },

  // Huyện Mộ Đức
  {
    id: 'md_mo_duc_1',
    name: 'THPT Mộ Đức 1',
    district: 'Huyện Mộ Đức',
    address: 'Thị trấn Đồng Cát, Huyện Mộ Đức'
  },
  {
    id: 'md_mo_duc_2',
    name: 'THPT Mộ Đức 2',
    district: 'Huyện Mộ Đức',
    address: 'Xã Đức Tân, Huyện Mộ Đức'
  },
  {
    id: 'md_pham_van_dong',
    name: 'THPT Phạm Văn Đồng',
    district: 'Huyện Mộ Đức',
    address: 'Xã Đức Tân, Huyện Mộ Đức'
  },
  {
    id: 'md_nguyen_cong_phuong',
    name: 'THPT Nguyễn Công Phương',
    district: 'Huyện Mộ Đức',
    address: 'Xã Đức Hòa, Huyện Mộ Đức'
  },

  // Thị xã Đức Phổ
  {
    id: 'dp_so_1',
    name: 'THPT Số 1 Đức Phổ',
    district: 'Thị xã Đức Phổ',
    address: 'Phường Nguyễn Nghiêm, Thị xã Đức Phổ'
  },
  {
    id: 'dp_so_2',
    name: 'THPT Số 2 Đức Phổ',
    district: 'Thị xã Đức Phổ',
    address: 'Phường Phổ Minh, Thị xã Đức Phổ'
  },
  {
    id: 'dp_luong_the_vinh',
    name: 'THPT Lương Thế Vinh',
    district: 'Thị xã Đức Phổ',
    address: 'Phường Phổ Thạnh, Thị xã Đức Phổ'
  },

  // Các khu vực khác
  {
    id: 'ls_ly_son',
    name: 'THPT Lý Sơn',
    district: 'Huyện Lý Sơn',
    address: 'Huyện đảo Lý Sơn, Tỉnh Quảng Ngãi'
  },
  {
    id: 'ml_minh_long',
    name: 'THPT Minh Long',
    district: 'Huyện Minh Long',
    address: 'Xã Long Hiệp, Huyện Minh Long'
  },
  {
    id: 'sh_son_ha',
    name: 'THPT Sơn Hà',
    district: 'Huyện Sơn Hà',
    address: 'Thị trấn Di Lăng, Huyện Sơn Hà'
  },
  {
    id: 'sh_so_2',
    name: 'THPT Số 2 Sơn Hà',
    district: 'Huyện Sơn Hà',
    address: 'Xã Sơn Hạ, Huyện Sơn Hà'
  },
  {
    id: 'tt_tay_tra',
    name: 'THPT Tây Trà',
    district: 'Huyện Tây Trà',
    address: 'Xã Trà Phong, Huyện Tây Trà'
  },
  {
    id: 'tb_tra_bong',
    name: 'THPT Trà Bồng',
    district: 'Huyện Trà Bồng',
    address: 'Thị trấn Trà Xuân, Huyện Trà Bồng'
  },
  {
    id: 'st_son_tay',
    name: 'THPT Sơn Tây',
    district: 'Huyện Sơn Tây',
    address: 'Xã Sơn Dung, Huyện Sơn Tây'
  },
  {
    id: 'bt_ba_to',
    name: 'THPT Ba Tơ',
    district: 'Huyện Ba Tơ',
    address: 'Thị trấn Ba Tơ, Huyện Ba Tơ'
  }
];

export function getSchoolsByDistrict(district: string): School[] {
  return QUANG_NGAI_SCHOOLS.filter(s => s.district === district);
}

export interface SchoolRankingItem {
  id: string;
  rank: number;
  name: string;
  district: string;
  studentCount: number;
  totalPoints: number;
  avgScore: number;
  examsTaken: number;
  isUserSchool: boolean;
}

// Predefined baseline points and metrics for Quảng Ngãi high schools
const BASE_SCHOOL_METRICS: Record<string, { studentCount: number; basePoints: number; avgScore: number; examsTaken: number }> = {
  'THPT chuyên Lê Khiết': { studentCount: 542, basePoints: 94850, avgScore: 8.85, examsTaken: 2340 },
  'THPT Trần Quốc Tuấn': { studentCount: 489, basePoints: 81200, avgScore: 8.42, examsTaken: 1980 },
  'THPT Bình Sơn': { studentCount: 435, basePoints: 73600, avgScore: 8.15, examsTaken: 1650 },
  'THPT Ba Gia': { studentCount: 412, basePoints: 68900, avgScore: 7.98, examsTaken: 1520 },
  'THPT Số 1 Tư Nghĩa': { studentCount: 398, basePoints: 66400, avgScore: 7.92, examsTaken: 1460 },
  'THPT Chu Văn An': { studentCount: 375, basePoints: 62800, avgScore: 7.85, examsTaken: 1390 },
  'THPT Mộ Đức 1': { studentCount: 360, basePoints: 59300, avgScore: 7.78, examsTaken: 1310 },
  'THPT Số 1 Đức Phổ': { studentCount: 345, basePoints: 56700, avgScore: 7.72, examsTaken: 1250 },
  'THPT Huỳnh Thúc Kháng': { studentCount: 320, basePoints: 53100, avgScore: 7.65, examsTaken: 1180 },
  'THPT Võ Nguyên Giáp': { studentCount: 310, basePoints: 51200, avgScore: 7.60, examsTaken: 1120 },
  'THPT Lê Trung Đình': { studentCount: 295, basePoints: 48500, avgScore: 7.52, examsTaken: 1050 },
  'THPT Lý Sơn': { studentCount: 215, basePoints: 44300, avgScore: 7.48, examsTaken: 890 },
  'THPT Sơn Hà': { studentCount: 230, basePoints: 41800, avgScore: 7.35, examsTaken: 820 },
  'THPT Trà Bồng': { studentCount: 205, basePoints: 37600, avgScore: 7.22, examsTaken: 740 },
  'THPT Ba Tơ': { studentCount: 195, basePoints: 35100, avgScore: 7.15, examsTaken: 690 },
};

export function getSchoolRankings(userSchoolName?: string, userXP: number = 0): SchoolRankingItem[] {
  const list = QUANG_NGAI_SCHOOLS.map((school, index) => {
    const isUserSchool = Boolean(userSchoolName && school.name.toLowerCase() === userSchoolName.toLowerCase());
    const metric = BASE_SCHOOL_METRICS[school.name] || {
      studentCount: 180 + ((index * 17) % 150),
      basePoints: 32000 - index * 600,
      avgScore: 7.10 + ((index * 7) % 80) / 100,
      examsTaken: 600 + index * 20,
    };

    const finalPoints = metric.basePoints + (isUserSchool ? userXP : 0);
    const finalStudents = metric.studentCount + (isUserSchool ? 1 : 0);

    return {
      id: school.id,
      name: school.name,
      district: school.district,
      studentCount: finalStudents,
      totalPoints: finalPoints,
      avgScore: metric.avgScore,
      examsTaken: metric.examsTaken,
      isUserSchool,
      rank: 0,
    };
  });

  // Sort descending by totalPoints
  list.sort((a, b) => b.totalPoints - a.totalPoints);

  // Assign 1-indexed ranks
  return list.map((item, idx) => ({
    ...item,
    rank: idx + 1,
  }));
}
