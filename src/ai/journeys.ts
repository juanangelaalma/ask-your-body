import type {DraftJourney} from './draft';

/**
 * The journeys that must feel magical before any long-tail query is worth supporting.
 * Targets are registry keys; the resolver turns them into atlas concept ids at plan time.
 */
export const CURATED_JOURNEYS: DraftJourney[] = [
  {
    id: 'run',
    title: {en: 'What happens when you run?', id: 'Apa yang terjadi saat kamu berlari?'},
    summary: {
      en: 'Running raises demand for oxygen and energy, so the heart, lungs, circulation, and leg muscles all increase their output together.',
      id: 'Berlari meningkatkan kebutuhan oksigen dan energi, sehingga jantung, paru-paru, peredaran darah, dan otot kaki bekerja lebih keras bersama-sama.',
    },
    match: ['run', 'running', 'jog', 'jogging', 'sprint', 'marathon', '10 km', 'exercise', 'workout', 'lari', 'berlari', 'olahraga'],
    scenes: [
      {
        id: 'run-heart', title: {en: 'Your heart works harder', id: 'Jantung bekerja lebih keras'},
        narration: {
          en: 'The moment you start running, your muscles ask for more oxygen, so the heart beats faster and pushes more blood with every beat.',
          id: 'Begitu kamu mulai berlari, otot meminta lebih banyak oksigen, sehingga jantung berdetak lebih cepat dan memompa lebih banyak darah setiap denyut.',
        },
        structures: ['heart'], actions: [{type: 'focus', target: 'heart'}, {type: 'highlight', target: 'heart'}, {type: 'show_system', system: 'cardiac'}],
      },
      {
        id: 'run-lungs', title: {en: 'Breathing speeds up', id: 'Napas menjadi lebih cepat'},
        narration: {
          en: 'Breathing becomes faster and deeper. Your lungs take in more oxygen and release the carbon dioxide the working muscles are producing.',
          id: 'Napas menjadi lebih cepat dan dalam. Paru-paru menyerap lebih banyak oksigen dan melepas karbon dioksida yang dihasilkan otot.',
        },
        structures: ['lungs', 'diaphragm'], actions: [{type: 'focus', target: 'lungs'}, {type: 'highlight', target: 'lungs'}, {type: 'highlight', target: 'diaphragm'}, {type: 'show_system', system: 'respiratory'}],
      },
      {
        id: 'run-vessels', title: {en: 'Blood is rerouted to the muscles', id: 'Darah dialihkan ke otot'},
        narration: {
          en: 'Blood vessels widen so oxygen-rich blood reaches the working muscles, while veins bring the used blood back to the heart and lungs.',
          id: 'Pembuluh darah melebar agar darah kaya oksigen sampai ke otot, sementara vena membawa darah yang sudah terpakai kembali ke jantung dan paru-paru.',
        },
        structures: ['blood_vessels', 'aorta', 'veins'], actions: [{type: 'focus', target: 'aorta'}, {type: 'highlight', target: 'blood_vessels'}, {type: 'highlight', target: 'veins'}, {type: 'show_system', system: 'arterial'}, {type: 'show_system', system: 'venous'}],
      },
      {
        id: 'run-legs', title: {en: 'Your legs do the work', id: 'Kaki yang menggerakkan kamu'},
        narration: {
          en: 'Your thigh and calf muscles use that oxygen and fuel to contract again and again. That repeated contraction is what carries you forward, and it is also why you feel warm.',
          id: 'Otot paha dan betis memakai oksigen dan bahan bakar itu untuk berkontraksi berulang kali. Kontraksi itulah yang membawa kamu maju, dan itu juga alasan tubuhmu terasa hangat.',
        },
        structures: ['quadriceps', 'calf'], actions: [{type: 'focus', target: 'quadriceps'}, {type: 'highlight', target: 'quadriceps'}, {type: 'highlight', target: 'calf'}, {type: 'show_system', system: 'muscular'}],
      },
    ],
    suggestions: {
      en: ['Why does my heart stay fast after I stop?', 'Why do muscles get tired?', 'How does oxygen reach my muscles?'],
      id: ['Mengapa jantung masih cepat setelah berhenti?', 'Mengapa otot bisa lelah?', 'Bagaimana oksigen sampai ke otot?'],
    },
  },
  {
    id: 'breathing',
    title: {en: 'How does breathing work?', id: 'Bagaimana pernapasan bekerja?'},
    summary: {
      en: 'Breathing is a pressure pump: muscles change the size of your chest, air flows in, and the lungs swap oxygen for carbon dioxide.',
      id: 'Bernapas adalah pompa tekanan: otot mengubah ukuran rongga dada, udara mengalir masuk, dan paru-paru menukar oksigen dengan karbon dioksida.',
    },
    match: ['breathing', 'breathe', 'breath', 'respiration', 'inhale', 'exhale', 'lungs', 'bernapas', 'pernapasan', 'napas'],
    scenes: [
      {
        id: 'breath-airway', title: {en: 'The airway', id: 'Jalur udara'},
        narration: {
          en: 'Air enters through your nose, where it is warmed and filtered, then travels down the trachea and splits into the bronchi that lead to each lung.',
          id: 'Udara masuk melalui hidung, dihangatkan dan disaring, lalu turun melalui trakea dan bercabang menjadi bronkus menuju masing-masing paru-paru.',
        },
        structures: ['nose', 'trachea', 'bronchus'], actions: [{type: 'show_system', system: 'respiratory'}, {type: 'focus', target: 'trachea'}, {type: 'highlight', target: 'trachea'}, {type: 'highlight', target: 'bronchus'}],
      },
      {
        id: 'breath-diaphragm', title: {en: 'The diaphragm pulls air in', id: 'Diafragma menarik udara masuk'},
        narration: {
          en: 'When the diaphragm contracts it flattens and moves down while the ribs lift. The chest expands, pressure drops, and air is drawn in. Breathing out is mostly that muscle letting go.',
          id: 'Saat diafragma berkontraksi, otot ini mendatar dan turun sementara tulang rusuk terangkat. Rongga dada membesar, tekanan menurun, dan udara masuk. Mengembuskan napas sebagian besar adalah otot itu melemas.',
        },
        structures: ['diaphragm', 'ribs'], actions: [{type: 'focus', target: 'diaphragm'}, {type: 'highlight', target: 'diaphragm'}, {type: 'highlight', target: 'ribs'}, {type: 'show_system', system: 'skeletal'}],
      },
      {
        id: 'breath-lungs', title: {en: 'Where the gases swap', id: 'Tempat pertukaran gas'},
        narration: {
          en: 'Inside the lungs, air meets a very fine network of blood vessels. Oxygen crosses into the blood and carbon dioxide crosses out, so every breath quietly swaps one gas for the other.',
          id: 'Di dalam paru-paru, udara bertemu jaringan pembuluh darah yang sangat halus. Oksigen masuk ke darah dan karbon dioksida keluar, sehingga setiap napas menukar kedua gas itu.',
        },
        structures: ['lungs'], actions: [{type: 'focus', target: 'lungs'}, {type: 'highlight', target: 'lungs'}, {type: 'show_system', system: 'respiratory'}],
      },
    ],
    suggestions: {
      en: ['Why do we need lungs?', 'What happens when I hold my breath?', 'Why does breathing speed up during exercise?'],
      id: ['Mengapa kita butuh paru-paru?', 'Apa yang terjadi saat menahan napas?', 'Mengapa napas menjadi cepat saat olahraga?'],
    },
  },
  {
    id: 'circulation',
    title: {en: 'How does blood circulate through the body?', id: 'Bagaimana darah beredar di tubuh?'},
    summary: {
      en: 'Two loops run at once: the heart sends blood to the lungs for oxygen, then out through the arteries to the body and back through the veins.',
      id: 'Ada dua aliran: jantung mengirim darah ke paru-paru untuk mengambil oksigen, lalu keluar melalui arteri ke seluruh tubuh dan kembali melalui vena.',
    },
    match: ['circulat', 'blood flow', 'blood travel', 'blood go', 'aliran darah', 'peredaran darah', 'blood vessels', 'darah'],
    scenes: [
      {
        id: 'circ-heart', title: {en: 'The pump', id: 'Pompa utamanya'},
        narration: {
          en: 'The heart is the pump that drives everything. Its right side sends blood to the lungs to collect oxygen, and its left side sends that blood out to the rest of the body.',
          id: 'Jantung adalah pompa yang menggerakkan semuanya. Sisi kanan mengirim darah ke paru-paru untuk mengambil oksigen, dan sisi kiri mengirim darah itu ke seluruh tubuh.',
        },
        structures: ['heart'], actions: [{type: 'focus', target: 'heart'}, {type: 'highlight', target: 'heart'}, {type: 'isolate', targets: ['heart']}],
      },
      {
        id: 'circ-arteries', title: {en: 'Arteries carry it out', id: 'Arteri membawanya keluar'},
        narration: {
          en: 'Arteries carry blood away from the heart under pressure. The aorta is the main trunk, branching into smaller arteries that reach every tissue.',
          id: 'Arteri membawa darah keluar dari jantung dengan tekanan. Aorta adalah batang utamanya, bercabang menjadi arteri yang lebih kecil menuju setiap jaringan.',
        },
        structures: ['aorta', 'arteries'], actions: [{type: 'show_system', system: 'arterial'}, {type: 'focus', target: 'aorta'}, {type: 'highlight', target: 'aorta'}, {type: 'highlight', target: 'arteries'}],
      },
      {
        id: 'circ-veins', title: {en: 'Veins bring it back', id: 'Vena membawanya kembali'},
        narration: {
          en: 'Veins collect blood after the tissues have taken what they need and carry it back toward the heart, where the cycle begins again.',
          id: 'Vena mengumpulkan darah setelah jaringan mengambil kebutuhannya dan membawanya kembali ke jantung, lalu siklus dimulai lagi.',
        },
        structures: ['veins'], actions: [{type: 'show_system', system: 'venous'}, {type: 'focus', target: 'veins'}, {type: 'highlight', target: 'veins'}],
      },
    ],
    suggestions: {
      en: ['How does the heart work?', 'What happens when I run?', 'Why do we need lungs?'],
      id: ['Bagaimana jantung bekerja?', 'Apa yang terjadi saat berlari?', 'Mengapa kita butuh paru-paru?'],
    },
  },
  {
    id: 'eat',
    title: {en: 'What happens when you eat?', id: 'Apa yang terjadi saat kamu makan?'},
    summary: {
      en: 'Food travels a long tube where it is broken down mechanically and chemically, its nutrients absorbed, and what is left prepared to leave.',
      id: 'Makanan melewati saluran panjang, dipecah secara mekanis dan kimiawi, nutrisinya diserap, dan sisanya disiapkan untuk dikeluarkan.',
    },
    match: ['eat', 'eating', 'food', 'digest', 'swallow', 'meal', 'makan', 'makanan', 'pencernaan', 'cerna'],
    scenes: [
      {
        id: 'eat-mouth', title: {en: 'It starts in the mouth', id: 'Dimulai dari mulut'},
        narration: {
          en: 'Digestion begins before you swallow. Teeth break the food into smaller pieces and saliva starts working on starches while the tongue shapes it into a ball you can swallow.',
          id: 'Pencernaan dimulai sebelum kamu menelan. Gigi memecah makanan dan air liur mulai bekerja pada karbohidrat sementara lidah membentuknya menjadi gumpalan yang bisa ditelan.',
        },
        structures: ['mouth', 'tongue'], actions: [{type: 'show_system', system: 'digestive'}, {type: 'focus', target: 'mouth'}, {type: 'highlight', target: 'mouth'}, {type: 'highlight', target: 'tongue'}],
      },
      {
        id: 'eat-esophagus', title: {en: 'Down the esophagus', id: 'Turun melalui kerongkongan'},
        narration: {
          en: 'The esophagus pushes the food down with wave-like muscle contractions, so it reaches the stomach even if you are lying down or in zero gravity.',
          id: 'Kerongkongan mendorong makanan ke bawah dengan gerakan otot seperti gelombang, sehingga makanan tetap sampai ke lambung meski kamu berbaring.',
        },
        structures: ['esophagus'], actions: [{type: 'focus', target: 'esophagus'}, {type: 'highlight', target: 'esophagus'}],
      },
      {
        id: 'eat-stomach', title: {en: 'The stomach mixes and waits', id: 'Lambung mengaduk dan menahan'},
        narration: {
          en: 'The stomach churns food with acid and enzymes until it becomes a thick paste, then releases it into the small intestine in measured amounts.',
          id: 'Lambung mengaduk makanan dengan asam dan enzim hingga menjadi bubur kental, lalu melepaskannya ke usus halus sedikit demi sedikit.',
        },
        structures: ['stomach'], actions: [{type: 'focus', target: 'stomach'}, {type: 'highlight', target: 'stomach'}],
      },
      {
        id: 'eat-absorb', title: {en: 'Where nutrients are absorbed', id: 'Tempat nutrisi diserap'},
        narration: {
          en: 'Most nutrients are absorbed in the small intestine. The liver processes what arrives through the blood, and the pancreas supplies enzymes that break the food down further.',
          id: 'Sebagian besar nutrisi diserap di usus halus. Hati memproses zat yang masuk melalui darah, dan pankreas memasok enzim untuk memecah makanan lebih lanjut.',
        },
        structures: ['small_intestine', 'liver', 'pancreas'], actions: [{type: 'focus', target: 'small_intestine'}, {type: 'highlight', target: 'small_intestine'}, {type: 'highlight', target: 'liver'}, {type: 'highlight', target: 'pancreas'}],
      },
      {
        id: 'eat-colon', title: {en: 'Water is reclaimed', id: 'Air diserap kembali'},
        narration: {
          en: 'By the large intestine most nutrients are gone. Water is absorbed here, and what remains is compacted and prepared to leave the body.',
          id: 'Di usus besar, sebagian besar nutrisi sudah habis. Air diserap di sini, dan sisanya dipadatkan lalu disiapkan untuk dikeluarkan.',
        },
        structures: ['large_intestine'], actions: [{type: 'focus', target: 'large_intestine'}, {type: 'highlight', target: 'large_intestine'}],
      },
    ],
    suggestions: {
      en: ['How does the liver help with digestion?', 'Where does water go when I drink?', 'Why do I feel sleepy after a big meal?'],
      id: ['Bagaimana hati membantu pencernaan?', 'Ke mana air pergi saat aku minum?', 'Mengapa mengantuk setelah makan banyak?'],
    },
  },
  {
    id: 'heart',
    title: {en: 'How does the heart work?', id: 'Bagaimana jantung bekerja?'},
    summary: {
      en: 'The heart is two pumps side by side: one sends blood to the lungs, the other sends it to the body, and valves keep it moving one way.',
      id: 'Jantung adalah dua pompa berdampingan: satu mengirim darah ke paru-paru, satu lagi ke seluruh tubuh, dan katup menjaga aliran satu arah.',
    },
    match: ['how does the heart work', 'heart work', 'heartbeat', 'heart beat', 'heart pump', 'heart do', 'jantung bekerja', 'detak jantung', 'jantung'],
    scenes: [
      {
        id: 'heart-chambers', title: {en: 'Four chambers', id: 'Empat ruang'},
        narration: {
          en: 'The heart has four chambers. The two upper atria receive blood and the two lower ventricles pump it out, while valves make sure it only moves forward.',
          id: 'Jantung punya empat ruang. Dua serambi di atas menerima darah dan dua bilik di bawah memompanya keluar, sementara katup memastikan darah hanya bergerak satu arah.',
        },
        structures: ['heart'], actions: [{type: 'focus', target: 'heart'}, {type: 'highlight', target: 'heart'}, {type: 'isolate', targets: ['heart']}],
      },
      {
        id: 'heart-circuits', title: {en: 'Two circuits', id: 'Dua aliran'},
        narration: {
          en: 'The right side sends blood to the lungs and the left side sends it to the body. So the heart is really two pumps working in step, one after the other.',
          id: 'Sisi kanan mengirim darah ke paru-paru dan sisi kiri ke seluruh tubuh. Jadi jantung sebenarnya dua pompa yang bekerja seirama.',
        },
        structures: ['heart', 'lungs'], actions: [{type: 'focus', target: 'lungs'}, {type: 'highlight', target: 'heart'}, {type: 'highlight', target: 'lungs'}, {type: 'show_system', system: 'respiratory'}],
      },
      {
        id: 'heart-aorta', title: {en: 'Out through the aorta', id: 'Keluar melalui aorta'},
        narration: {
          en: 'Oxygen-rich blood leaves the left ventricle through the aorta, the largest artery in the body, and from there it is distributed to every organ.',
          id: 'Darah kaya oksigen meninggalkan bilik kiri melalui aorta, arteri terbesar di tubuh, lalu disebarkan ke seluruh organ.',
        },
        structures: ['aorta', 'arteries'], actions: [{type: 'focus', target: 'aorta'}, {type: 'highlight', target: 'aorta'}, {type: 'show_system', system: 'arterial'}],
      },
    ],
    suggestions: {
      en: ['How does blood circulate through the body?', 'What happens when I run?', 'What makes the heartbeat?'],
      id: ['Bagaimana darah beredar di tubuh?', 'Apa yang terjadi saat berlari?', 'Apa yang membuat jantung berdetak?'],
    },
  },
  {
    id: 'lungs',
    title: {en: 'Why do we need lungs?', id: 'Mengapa kita butuh paru-paru?'},
    summary: {
      en: 'Lungs are where air meets blood. Without that meeting point, oxygen could never enter the bloodstream.',
      id: 'Paru-paru adalah tempat udara bertemu darah. Tanpa titik temu itu, oksigen tidak akan pernah masuk ke aliran darah.',
    },
    match: ['need lungs', 'why lungs', 'lungs for', 'what do lungs do', 'paru paru', 'fungsi paru'],
    scenes: [
      {
        id: 'lungs-airway', title: {en: 'A route for air', id: 'Jalur untuk udara'},
        narration: {
          en: 'Air has to reach the blood, and the airways are the route. The trachea carries it down and the bronchi split it between the two lungs.',
          id: 'Udara harus mencapai darah, dan saluran napas adalah jalurnya. Trakea menuntunnya ke bawah dan bronkus membaginya ke kedua paru-paru.',
        },
        structures: ['larynx', 'trachea', 'bronchus'], actions: [{type: 'show_system', system: 'respiratory'}, {type: 'focus', target: 'trachea'}, {type: 'highlight', target: 'trachea'}, {type: 'highlight', target: 'bronchus'}],
      },
      {
        id: 'lungs-surface', title: {en: 'A huge meeting surface', id: 'Permukaan pertemuan yang luas'},
        narration: {
          en: 'The lungs pack an enormous, very thin surface into the chest. Oxygen slips into the blood there, and carbon dioxide slips out to be breathed away.',
          id: 'Paru-paru memadatkan permukaan yang sangat luas dan tipis di dalam dada. Oksigen masuk ke darah di sana, dan karbon dioksida keluar untuk diembuskan.',
        },
        structures: ['lungs'], actions: [{type: 'focus', target: 'lungs'}, {type: 'highlight', target: 'lungs'}],
      },
      {
        id: 'lungs-muscles', title: {en: 'The lungs need help', id: 'Paru-paru butuh bantuan'},
        narration: {
          en: 'Lungs have no muscle of their own to move air. The diaphragm and the rib muscles change the pressure inside the chest, which pulls air in and pushes it out.',
          id: 'Paru-paru tidak punya otot sendiri untuk menggerakkan udara. Diafragma dan otot tulang rusuk mengubah tekanan di rongga dada, sehingga udara masuk dan keluar.',
        },
        structures: ['diaphragm', 'ribs'], actions: [{type: 'focus', target: 'diaphragm'}, {type: 'highlight', target: 'diaphragm'}, {type: 'highlight', target: 'ribs'}, {type: 'show_system', system: 'skeletal'}],
      },
    ],
    suggestions: {
      en: ['How does breathing work?', 'Why does my breathing speed up when I exercise?', 'What happens when I hold my breath?'],
      id: ['Bagaimana pernapasan bekerja?', 'Mengapa napas cepat saat olahraga?', 'Apa yang terjadi saat menahan napas?'],
    },
  },
  {
    id: 'brain',
    title: {en: 'How does the brain control the body?', id: 'Bagaimana otak mengendalikan tubuh?'},
    summary: {
      en: 'The brain decides, the spinal cord carries, and nerves deliver: a two-way network of signals between the centre and the body.',
      id: 'Otak memutuskan, sumsum tulang belakang menyalurkan, dan saraf mengantarkan: jaringan sinyal dua arah antara pusat dan tubuh.',
    },
    match: ['brain control', 'brain', 'nervous system', 'nerves', 'otak', 'saraf'],
    scenes: [
      {
        id: 'brain-centre', title: {en: 'The control centre', id: 'Pusat kendali'},
        narration: {
          en: 'The brain is the control centre. Different regions handle movement, sensation, memory, and the automatic housekeeping, like heart rate and breathing, that keeps you alive.',
          id: 'Otak adalah pusat kendali. Bagian-bagiannya menangani gerakan, sensasi, ingatan, dan pekerjaan otomatis seperti detak jantung dan napas yang menjaga hidupmu.',
        },
        structures: ['brain'], actions: [{type: 'show_system', system: 'nervous'}, {type: 'focus', target: 'brain'}, {type: 'highlight', target: 'brain'}, {type: 'isolate', targets: ['brain']}],
      },
      {
        id: 'brain-cord', title: {en: 'The main cable', id: 'Kabel utama'},
        narration: {
          en: 'Signals travel along the spinal cord, the main cable between the brain and the body. Some reflexes shortcut through it before the brain has even caught up.',
          id: 'Sinyal berjalan melalui sumsum tulang belakang, kabel utama antara otak dan tubuh. Sebagian refleks melewatinya lebih dulu sebelum otak menyadarinya.',
        },
        structures: ['spinal_cord', 'spine'], actions: [{type: 'focus', target: 'spinal_cord'}, {type: 'highlight', target: 'spinal_cord'}, {type: 'show_system', system: 'skeletal'}],
      },
      {
        id: 'brain-nerves', title: {en: 'Out to the body', id: 'Keluar menuju tubuh'},
        narration: {
          en: 'Peripheral nerves carry instructions out to muscles and bring sensation back in. That constant two-way traffic is how the brain stays in touch with the rest of you.',
          id: 'Saraf tepi membawa perintah ke otot dan mengembalikan sensasi ke pusat. Lalu lintas dua arah inilah yang membuat otak tetap terhubung dengan tubuhmu.',
        },
        structures: ['nerves'], actions: [{type: 'focus', target: 'nerves'}, {type: 'highlight', target: 'nerves'}],
      },
    ],
    suggestions: {
      en: ['What happens in the brain when I sleep?', 'How does the brain get oxygen?', 'Why do we feel pain?'],
      id: ['Apa yang terjadi di otak saat tidur?', 'Bagaimana otak mendapat oksigen?', 'Mengapa kita merasakan nyeri?'],
    },
  },
  {
    id: 'muscle-fatigue',
    title: {en: 'Why do muscles get tired?', id: 'Mengapa otot bisa lelah?'},
    summary: {
      en: 'Fatigue is mostly about supply: a muscle that keeps contracting can outrun the oxygen and fuel it needs.',
      id: 'Kelelahan terutama soal pasokan: otot yang terus berkontraksi bisa melebihi oksigen dan bahan bakar yang tersedia.',
    },
    match: ['muscle tired', 'muscles get tired', 'muscle fatigue', 'fatigue', 'sore muscles', 'muscles hurt', 'otot lelah', 'otot capek', 'pegal', 'lelah'],
    scenes: [
      {
        id: 'fatigue-muscle', title: {en: 'Every contraction costs energy', id: 'Setiap kontraksi butuh energi'},
        narration: {
          en: 'A working muscle contracts over and over, and every contraction costs energy. When demand outruns supply, contractions weaken and the muscle feels heavy and sore.',
          id: 'Otot yang bekerja berkontraksi berulang kali, dan setiap kontraksi membutuhkan energi. Ketika kebutuhan melebihi pasokan, kontraksi melemah dan otot terasa berat serta pegal.',
        },
        structures: ['muscles', 'quadriceps'], actions: [{type: 'show_system', system: 'muscular'}, {type: 'isolate', targets: ['quadriceps']}, {type: 'focus', target: 'quadriceps'}, {type: 'highlight', target: 'quadriceps'}],
      },
      {
        id: 'fatigue-delivery', title: {en: 'It is often about delivery', id: 'Sering kali soal pasokan'},
        narration: {
          en: 'The lungs load oxygen, the heart pumps it, and the vessels carry it to the muscle. If any link in that chain cannot keep up, the muscle runs short.',
          id: 'Paru-paru memuat oksigen, jantung memompanya, dan pembuluh darah mengantarkannya ke otot. Jika satu mata rantai tertinggal, otot kekurangan pasokan.',
        },
        structures: ['heart', 'lungs', 'blood_vessels'], actions: [{type: 'focus', target: 'lungs'}, {type: 'highlight', target: 'lungs'}, {type: 'highlight', target: 'heart'}, {type: 'highlight', target: 'blood_vessels'}, {type: 'show_system', system: 'cardiac'}],
      },
      {
        id: 'fatigue-fuel', title: {en: 'Fuel runs down too', id: 'Bahan bakar juga menipis'},
        narration: {
          en: 'Muscles also draw on stored fuel, and the liver releases glucose into the blood to top it up. When those stores run low, you feel it as tiredness.',
          id: 'Otot juga memakai bahan bakar yang tersimpan, dan hati melepaskan glukosa ke darah untuk menambahnya. Ketika cadangan menipis, kamu merasakannya sebagai kelelahan.',
        },
        structures: ['liver', 'muscles'], actions: [{type: 'focus', target: 'liver'}, {type: 'highlight', target: 'liver'}, {type: 'highlight', target: 'muscles'}],
      },
    ],
    suggestions: {
      en: ['How does oxygen reach my muscles?', 'Does stretching help sore muscles?', 'Why do I breathe harder during exercise?'],
      id: ['Bagaimana oksigen sampai ke otot?', 'Apakah peregangan membantu otot pegal?', 'Mengapa napas berat saat olahraga?'],
    },
  },
  {
    id: 'hold-breath',
    title: {en: 'What happens when you hold your breath?', id: 'Apa yang terjadi saat kamu menahan napas?'},
    summary: {
      en: 'Holding your breath stops the airflow, not the chemistry: oxygen keeps being used and carbon dioxide keeps building until the brain overrides you.',
      id: 'Menahan napas menghentikan aliran udara, bukan proses kimianya: oksigen terus terpakai dan karbon dioksida menumpuk sampai otak mengambil alih.',
    },
    match: ['hold my breath', 'holding breath', 'hold breath', 'menahan napas', 'tahan napas'],
    scenes: [
      {
        id: 'hold-diaphragm', title: {en: 'Everything stops moving', id: 'Semuanya berhenti bergerak'},
        narration: {
          en: 'Holding your breath means keeping the diaphragm and rib muscles still. The chest stops changing size, so no air moves in or out.',
          id: 'Menahan napas berarti menahan diafragma dan otot tulang rusuk tetap diam. Rongga dada berhenti berubah ukuran, sehingga tidak ada udara masuk atau keluar.',
        },
        structures: ['diaphragm', 'ribs'], actions: [{type: 'focus', target: 'diaphragm'}, {type: 'highlight', target: 'diaphragm'}, {type: 'highlight', target: 'ribs'}],
      },
      {
        id: 'hold-lungs', title: {en: 'The gases drift apart', id: 'Kedua gas mulai tidak seimbang'},
        narration: {
          en: 'With no fresh air coming in, the oxygen already in your lungs is gradually used up while carbon dioxide builds in the blood.',
          id: 'Karena tidak ada udara segar masuk, oksigen yang ada di paru-paru perlahan terpakai sementara karbon dioksida menumpuk di darah.',
        },
        structures: ['lungs'], actions: [{type: 'focus', target: 'lungs'}, {type: 'highlight', target: 'lungs'}, {type: 'show_system', system: 'respiratory'}],
      },
      {
        id: 'hold-brain', title: {en: 'The brain overrules you', id: 'Otak mengalahkan keinginanmu'},
        narration: {
          en: 'Rising carbon dioxide is the signal the brainstem watches. It produces a strong urge to breathe, and that urge eventually overrides your will to hold on.',
          id: 'Karbon dioksida yang meningkat adalah sinyal yang dipantau batang otak. Sinyal itu memunculkan dorongan kuat untuk bernapas, dan dorongan itu akhirnya mengalahkan keinginanmu.',
        },
        structures: ['brainstem', 'brain'], actions: [{type: 'show_system', system: 'nervous'}, {type: 'isolate', targets: ['brainstem']}, {type: 'focus', target: 'brainstem'}, {type: 'highlight', target: 'brainstem'}],
      },
      {
        id: 'hold-recovery', title: {en: 'The recovery breaths', id: 'Napas pemulihan'},
        narration: {
          en: 'The heart kept circulating whatever oxygen was left. When the signal to breathe wins, the first breaths come deep and fast to correct the balance.',
          id: 'Jantung tetap mengedarkan oksigen yang tersisa. Ketika dorongan bernapas menang, napas pertama menjadi dalam dan cepat untuk memperbaiki keseimbangan.',
        },
        structures: ['heart'], actions: [{type: 'focus', target: 'heart'}, {type: 'highlight', target: 'heart'}, {type: 'show_system', system: 'cardiac'}],
      },
    ],
    suggestions: {
      en: ['How does breathing work?', 'Why do we need lungs?', 'Why is holding your breath underwater risky?'],
      id: ['Bagaimana pernapasan bekerja?', 'Mengapa kita butuh paru-paru?', 'Mengapa menahan napas di air berisiko?'],
    },
  },
  {
    id: 'sleep',
    title: {en: 'What happens when you sleep?', id: 'Apa yang terjadi saat kamu tidur?'},
    summary: {
      en: 'Sleep is something the brain actively produces. Body systems quiet down while the brain cycles through stages and does repair work.',
      id: 'Tidur adalah sesuatu yang otak hasilkan secara aktif. Sistem tubuh melambat sementara otak melewati tahapan dan melakukan perbaikan.',
    },
    match: ['sleep', 'sleeping', 'when i sleep', 'at night', 'tidur', 'istirahat malam'],
    scenes: [
      {
        id: 'sleep-brain', title: {en: 'The brain switches you off', id: 'Otak yang menidurkanmu'},
        narration: {
          en: 'Sleep is not just the absence of waking. The hypothalamus helps switch the brain into sleep and back out again as part of your daily rhythm.',
          id: 'Tidur bukan sekadar tidak terjaga. Hipotalamus membantu otak beralih ke tidur dan kembali bangun sebagai bagian dari ritme harianmu.',
        },
        structures: ['brain', 'hypothalamus'], actions: [{type: 'show_system', system: 'nervous'}, {type: 'focus', target: 'hypothalamus'}, {type: 'highlight', target: 'hypothalamus'}, {type: 'highlight', target: 'brain'}],
      },
      {
        id: 'sleep-melatonin', title: {en: 'A chemical signal for night', id: 'Sinyal kimia untuk malam'},
        narration: {
          en: 'In the evening the pineal body releases melatonin, which helps time your sleep. Light on your eyes in the morning pulls that signal back down.',
          id: 'Menjelang malam, kelenjar pineal melepaskan melatonin yang membantu mengatur waktu tidur. Cahaya yang masuk ke mata pada pagi hari menurunkannya kembali.',
        },
        structures: ['pineal'], actions: [{type: 'show_system', system: 'endocrine'}, {type: 'focus', target: 'pineal'}, {type: 'highlight', target: 'pineal'}],
      },
      {
        id: 'sleep-slows', title: {en: 'Body systems quiet down', id: 'Sistem tubuh melambat'},
        narration: {
          en: 'Heart rate and breathing slow, blood pressure dips, and muscles relax. At the same time the brain keeps cycling through deeper and lighter stages.',
          id: 'Detak jantung dan napas melambat, tekanan darah menurun, dan otot rileks. Di saat yang sama otak tetap melewati tahap tidur dalam dan ringan.',
        },
        structures: ['heart', 'lungs', 'muscles'], actions: [{type: 'focus', target: 'heart'}, {type: 'highlight', target: 'heart'}, {type: 'highlight', target: 'lungs'}, {type: 'highlight', target: 'muscles'}],
      },
      {
        id: 'sleep-repair', title: {en: 'Rest and repair', id: 'Istirahat dan perbaikan'},
        narration: {
          en: 'During sleep the body repairs tissue and the brain sorts what you learned that day. That is part of why a short night leaves you foggy.',
          id: 'Selama tidur, tubuh memperbaiki jaringan dan otak merapikan hal yang kamu pelajari hari itu. Itu sebagian alasan kurang tidur membuatmu sulit berpikir jernih.',
        },
        structures: ['brain', 'liver', 'muscles'], actions: [{type: 'focus', target: 'brain'}, {type: 'highlight', target: 'brain'}, {type: 'highlight', target: 'liver'}, {type: 'highlight', target: 'muscles'}],
      },
    ],
    suggestions: {
      en: ['What happens in the brain during deep sleep?', 'Why do I dream?', 'Why does the body need sleep?'],
      id: ['Apa yang terjadi di otak saat tidur dalam?', 'Mengapa kita bermimpi?', 'Mengapa tubuh butuh tidur?'],
    },
  },
];
