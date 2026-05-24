/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserLevel, Lesson, Rule } from './types.ts';

export const LESSONS: Lesson[] = [
  // SENIOR (VERY EASY - JUDA OSON)
  {
    id: 'sr-1',
    title: 'Sonlarni qo\'shish',
    description: 'Oddiy qo\'shish amallari va ularning ma\'nosi.',
    videoUrl: 'https://www.youtube.com/embed/S2pEToitw0I',
    level: UserLevel.SENIOR,
    quiz: [
      {
        id: 'q1',
        question: '5 + 3 necha?',
        options: ['7', '8', '9', '10'],
        correctAnswer: 1,
        explanation: '5 va 3 ning yig\'indisi 8 ga teng.'
      }
    ]
  },
  {
    id: 'sr-2',
    title: 'Geometrik shakllar',
    description: 'Aylana, kvadrat va uchburchak.',
    videoUrl: 'https://www.youtube.com/embed/jZf62D6lT5s',
    level: UserLevel.SENIOR,
    quiz: [
      {
        id: 'q2',
        question: 'Kvadratning nechta burchagi bor?',
        options: ['3', '4', '5', '6'],
        correctAnswer: 1,
        explanation: 'Kvadrat 4 ta burchakka ega.'
      }
    ]
  },

  // JUNIOR (MEDIUM - O'RTACHA)
  {
    id: 'jr-1',
    title: 'Ko\'paytirish jadvali',
    description: 'Sonlarni ko\'paytirish va bo\'lishning qulay usullari.',
    videoUrl: 'https://www.youtube.com/embed/S2pEToitw0I',
    level: UserLevel.JUNIOR,
    quiz: [
      {
        id: 'q3',
        question: '7 * 8 necha?',
        options: ['54', '56', '58', '60'],
        correctAnswer: 1,
        explanation: '7 ni 8 ga ko\'paytirsak 56 bo\'ladi.'
      }
    ]
  },
  {
    id: 'jr-2',
    title: 'Oddiy kasrlar',
    description: 'Kasrlar nima va ular ustida amallar.',
    videoUrl: 'https://www.youtube.com/embed/l3XzpqIUP9E',
    level: UserLevel.JUNIOR,
    quiz: [
      {
        id: 'q4',
        question: '1/2 + 1/2 necha?',
        options: ['1/4', '1', '2', '1/2'],
        correctAnswer: 1,
        explanation: 'Yarimga yarimni qo\'shsak bir butun bo\'ladi.'
      }
    ]
  },

  // MASTER (VERY HARD - JUDA QIYIN)
  {
    id: 'ms-1',
    title: 'Murakkab tenglamalar',
    description: 'Oliy matematikadagi integral va differensiallar.',
    videoUrl: 'https://www.youtube.com/embed/aaXEnVjX-k8',
    level: UserLevel.MASTER,
    quiz: [
      {
        id: 'q5',
        question: 'f(x) = x^2 ning hosilasi nimaga teng?',
        options: ['x', '2x', 'x^3', '2'],
        correctAnswer: 1,
        explanation: 'Daraja qoidasiga ko\'ra (x^n)\' = n*x^(n-1).'
      }
    ]
  },
  {
    id: 'ms-2',
    title: 'Kombinatorika',
    description: 'Ehtimollar va tanlanmalar nazariyasi.',
    videoUrl: 'https://www.youtube.com/embed/SkadyH-F_64',
    level: UserLevel.MASTER,
    quiz: [
      {
        id: 'q6',
        question: '3 ta kitobni javonga necha xil usulda taxlash mumkin?',
        options: ['3', '6', '9', '12'],
        correctAnswer: 1,
        explanation: '3! = 3 * 2 * 1 = 6 xil usul.'
      }
    ]
  }
];

export const RULES: Rule[] = [
  // SENIOR
  {
    id: 'r-sr-1',
    title: 'Qo\'shish qonuni',
    content: 'Sonlarning o\'rnini almashtirsa ham yig\'indi o\'zgarmaydi: a + b = b + a.',
    level: UserLevel.SENIOR
  },
  {
    id: 'r-sr-2',
    title: 'Nol xossasi',
    content: 'Har qanday songa 0 ni qo\'shsak o\'sha sonning o\'zi kelib chiqadi: a + 0 = a.',
    level: UserLevel.SENIOR
  },
  // JUNIOR
  {
    id: 'r-jr-1',
    title: 'Ko\'paytirishning taqsimot qonuni',
    content: 'a * (b + c) = a * b + a * c. Bu qonun qavslarni ochishda yordam beradi.',
    level: UserLevel.JUNIOR
  },
  {
    id: 'r-jr-2',
    title: 'Pifagor teoremasi',
    content: 'To\'g\'ri burchakli uchburchakda katetlar kvadratlarining yig\'indisi gipotenuza kvadratiga teng: a² + b² = c².',
    level: UserLevel.JUNIOR
  },
  // MASTER
  {
    id: 'r-ms-1',
    title: 'Eyler formulasi',
    content: 'e^(i*pi) + 1 = 0. Bu matematika olamidagi eng go\'zal formulalardan biridir.',
    level: UserLevel.MASTER
  },
  {
    id: 'r-ms-2',
    title: 'Limit tushunchasi',
    content: 'Funksiyaning uzluksizligi va hosilani hisoblashda limit tushunchasi asosiy rol o\'ynaydi.',
    level: UserLevel.MASTER
  }
];

export const MANTIQIY_MASALALAR = [
  {
    question: "10 metrli tayoqni 1 minutadan kessak, hammasini bo'lish uchun necha minut ketadi?",
    options: ["10", "9", "11", "5"],
    answer: 1,
    explanation: "Oxirgi kesim 2 ta qism beradi, shuning uchun 9 marta kesish kifoya.",
    level: UserLevel.SENIOR,
    videoUrl: 'https://www.youtube.com/embed/8-WvL_D6gG4'
  },
  {
    question: "Savatda 5 ta olma bor. 5 kishiga bittadan berildi, savatda 1 ta qoldi. Nega?",
    options: ["Xato", "Yo'q", "Oxirgi kishi savati bilan oldi", "Yashirin olma"],
    answer: 2,
    explanation: "Oxirgi odam olmani savat ichida olgan.",
    level: UserLevel.SENIOR,
    videoUrl: 'https://www.youtube.com/embed/8-WvL_D6gG4'
  },
  {
    question: "Agar bugun dushanba bo'lsa, 100 kundan keyin qaysi kun bo'ladi?",
    options: ["Seshanba", "Chorshanba", "Payshanba", "Juma"],
    answer: 1,
    explanation: "100 = 14 * 7 + 2. Ikki kun keyingi kun - chorshanba.",
    level: UserLevel.JUNIOR,
    videoUrl: 'https://www.youtube.com/embed/8-WvL_D6gG4'
  },
  {
    question: "Hamma shifokorlar erkak emas. Ba'zi erkaklar uchuvchi. Demak...?",
    options: ["Ba'zi shifokorlar uchuvchi", "Ba'zi uchuvchilar ayol", "Hech qaysisi", "Noma'lum"],
    answer: 2,
    explanation: "Berilgan ma'lumotlar bilan bog'liqlikni aniqlab bo'lmaydi.",
    level: UserLevel.MASTER,
    videoUrl: 'https://www.youtube.com/embed/8-WvL_D6gG4'
  }
];
