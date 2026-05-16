const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

// ─── Data ─────────────────────────────────────────────────────────────────────

const adminUser = {
  name: "Admin",
  email: "admin@bookstore.com",
  password: "admin123",
  role: "ADMIN",
};

const rootCategories = [
  { name: "Badiiy adabiyot",    slug: "badiiy-adabiyot",    description: "Roman, qissa, hikoya va dramatik asarlar" },
  { name: "She'riyat",          slug: "sheriyat",            description: "G'azal, she'r, doston va lirik asarlar" },
  { name: "Klassik adabiyot",   slug: "klassik-adabiyot",   description: "Jahon va O'zbek adabiyotining bebaho durdonalari" },
  { name: "Zamonaviy adabiyot", slug: "zamonaviy-adabiyot", description: "Hozirgi zamon yozuvchilarining asarlari" },
  { name: "Bolalar adabiyoti",  slug: "bolalar-adabiyoti",  description: "Bolalar va o'smirlar uchun kitoblar" },
  { name: "Tarjima asarlari",   slug: "tarjima-asarlari",   description: "Jahon adabiyotidan o'zbek tiliga tarjimalar" },
  { name: "Ilmiy-ommabop",      slug: "ilmiy-ommabop",      description: "Fan va bilimni omma uchun tushuntiruvchi asarlar" },
];

const subCategories = [
  { name: "Roman",           slug: "roman",           description: "Katta hajmli badiiy nasriy asarlar",     parentSlug: "badiiy-adabiyot" },
  { name: "Qissa va novella", slug: "qissa-novella",  description: "O'rta hajmli badiiy nasriy asarlar",     parentSlug: "badiiy-adabiyot" },
  { name: "Hikoya",          slug: "hikoya",           description: "Kichik hajmli badiiy nasriy asarlar",    parentSlug: "badiiy-adabiyot" },
  { name: "Drama va komediya", slug: "drama-komediya", description: "Teatr va sahna uchun yozilgan asarlar", parentSlug: "badiiy-adabiyot" },
  { name: "Fantastika",      slug: "fantastika",       description: "Ilmiy fantastika va fantaziya asarlari", parentSlug: "badiiy-adabiyot" },
  { name: "Detektiv",        slug: "detektiv",         description: "Sirli voqealar va tergov asarlari",      parentSlug: "badiiy-adabiyot" },
  { name: "O'zbek klassiği", slug: "uzbek-klassigi",   description: "O'zbek adabiyotining klassik asarlari", parentSlug: "klassik-adabiyot" },
  { name: "Jahon klassiği",  slug: "jahon-klassigi",   description: "Jahon adabiyotining eng sara namunalari", parentSlug: "klassik-adabiyot" },
];

const authors = [
  { name: "Alisher Navoiy",         slug: "alisher-navoiy",         bio: "O'zbek adabiyotining sultoni, buyuk mutafakkir va shoir (1441–1501). Xamsa, Farhod va Shirin, Layli va Majnun asarlari muallifi." },
  { name: "Abdullah Qodiriy",       slug: "abdullah-qodiriy",       bio: "O'zbek romanchiligining asoschisi (1894–1938). O'tkan kunlar va Mehrobdan chayon romanlari muallifi. Julqunboy taxallusi bilan ham yozgan." },
  { name: "Cho'lpon",               slug: "cholpon",                 bio: "O'zbek adabiyotining yirik vakili, shoir va nasrnavis (1897–1938). Kecha va kunduz romani, ko'plab she'rlar muallifi." },
  { name: "Oybek",                  slug: "oybek",                   bio: "O'zbek sovet adabiyotining yirik namoyandasi (1905–1968). Qutlug' qon va Navoiy romanlarini yozgan." },
  { name: "G'afur G'ulom",          slug: "gafur-gulom",             bio: "O'zbek adabiyotining ulug' shoiri va nasrnnavisi (1903–1966). Shum bola va ko'plab she'rlar muallifi." },
  { name: "Abdulla Oripov",         slug: "abdulla-oripov",          bio: "O'zbekistonning xalq shoiri (1941–2016). O'zbekiston madhiyasi so'zlarining muallifi, lirik she'rlar ustasi." },
  { name: "Erkin Vohidov",          slug: "erkin-vohidov",           bio: "O'zbekistonning xalq shoiri (1936–2016). Ruhlar isyoni dostoni va lirik she'rlari bilan mashhur." },
  { name: "Shukur Xolmirzayev",     slug: "shukur-xolmirzayev",     bio: "O'zbek adibi, hikoyanavis (1940–2005). O'zbek qishlog'i hayotini so'z bilan jonlantirgan ijodkor." },
  { name: "Tog'ay Murod",           slug: "togay-murod",             bio: "O'zbek adibi (1948–2003). Oydinda yurgan odamlar romani va lirik prozasi bilan mashhur." },
  { name: "Leo Tolstoy",            slug: "lev-tolstoy",             bio: "Rus adabiyotining titans (1828–1910). Urush va tinchlik, Anna Karenina kabi bebaho romanlar muallifi." },
  { name: "Fyodor Dostoyevskiy",    slug: "fyodor-dostoyevskiy",     bio: "Rus adabiyotining buyuk faylasufi (1821–1881). Jinoyat va jazo, Idiot, Aka-uka Karamazovlar muallifi." },
  { name: "William Shakespeare",    slug: "william-shakespeare",     bio: "Ingliz adabiyotining eng buyuk dramaturgi (1564–1616). Hamlet, Romeo va Juletta, Otello asarlari muallifi." },
  { name: "Gabriel García Márquez", slug: "gabriel-garcia-marquez",  bio: "Kolumbiyalik Nobel mukofoti laureati (1927–2014). Sehrli realizm janrining asoschisi, Yuz yillik yolg'izlik muallifi." },
  { name: "Antoine de Saint-Exupéry", slug: "antoine-de-saint-exupery", bio: "Fransuz yozuvchisi va uchuvchi (1900–1944). Kichkina shahzoda — jahon adabiyotining eng sevimli asarlaridan birining muallifi." },
  { name: "Franz Kafka",            slug: "franz-kafka",             bio: "Chex-avstriyalik yozuvchi (1883–1924). Metamorfoza va Jarayon asarlari bilan absurd adabiyotga asos solgan." },
  { name: "Ernest Hemingway",       slug: "ernest-hemingway",        bio: "Amerika adabiyotining buyuk nomli vakili (1899–1961). Nobel laureati. Qari va dengiz, Kim uchun qo'ng'iroq chaling asarlari muallifi." },
  { name: "Miguel de Cervantes",    slug: "miguel-de-cervantes",     bio: "Ispan adabiyotining ulug'i (1547–1616). Don Kixot — jahon adabiyotining birinchi zamonaviy romani muallifi." },
  { name: "Alexandre Dumas",        slug: "alexandre-dumas",         bio: "Fransuz sarguzasht romani ustasi (1802–1870). Graf Monte-Kristo va Uch mushketyor muallifi." },
];

const tags = [
  { name: "Roman",             slug: "roman"            },
  { name: "She'riyat",         slug: "sheriyat-tag"     },
  { name: "Hikoya",            slug: "hikoya-tag"       },
  { name: "Qissa",             slug: "qissa"            },
  { name: "Drama",             slug: "drama"            },
  { name: "Klassik",           slug: "klassik"          },
  { name: "Zamonaviy",         slug: "zamonaviy"        },
  { name: "O'zbek adabiyoti",  slug: "uzbek-adabiyoti"  },
  { name: "Jahon adabiyoti",   slug: "jahon-adabiyoti"  },
  { name: "Tarjima",           slug: "tarjima"          },
  { name: "Falsafiy",          slug: "falsafiy"         },
  { name: "Psixologik",        slug: "psixologik"       },
  { name: "Sarguzasht",        slug: "sarguzasht"       },
  { name: "Tarixiy",           slug: "tarixiy"          },
  { name: "Detektiv",          slug: "detektiv-tag"     },
  { name: "Fantastika",        slug: "fantastika-tag"   },
  { name: "Bolalar",           slug: "bolalar"          },
];

const booksData = [
  // ── O'zbek klassiği ────────────────────────────────────────────────────────
  {
    title: "O'tkan kunlar",
    description: "O'zbek romanchiligining birinchi va eng buyuk asari. XIX asrning ikkinchi yarmida Turkistonda yashagan Otabek va Kumush sevgisi orqali bir davrning fojiasi tasvirlanadi. Milliy ruh va tarixiy haqiqat uyg'unligining noyob namunasi.",
    price: 35000, downloadCount: 4200, likeCount: 1850,
    categorySlug: "uzbek-klassigi", authorSlug: "abdullah-qodiriy",
    tags: ["Roman", "Tarixiy", "O'zbek adabiyoti", "Klassik"],
  },
  {
    title: "Mehrobdan chayon",
    description: "Abdullah Qodiriyning ikkinchi mashhur romani. Feodal zulm va eski an'analar iskanjasida qolgan Ro'zi Matning fojiali taqdiri orqali o'sha davr jamiyatining keskin tanqidi berilgan.",
    price: 29000, downloadCount: 2900, likeCount: 1100,
    categorySlug: "uzbek-klassigi", authorSlug: "abdullah-qodiriy",
    tags: ["Roman", "Tarixiy", "O'zbek adabiyoti", "Klassik", "Psixologik"],
  },
  {
    title: "Kecha va kunduz",
    description: "Cho'lponning yagona romani. Miryoqub bilan Zebi munosabatlari orqali XX asr boshidagi O'zbekiston hayotini, yangilik va eskilik to'qnashuvini jonli aks ettiradi.",
    price: 32000, downloadCount: 2400, likeCount: 980,
    categorySlug: "uzbek-klassigi", authorSlug: "cholpon",
    tags: ["Roman", "O'zbek adabiyoti", "Klassik", "Psixologik"],
  },
  {
    title: "Qutlug' qon",
    description: "Oybek qalamiga mansub tarixiy roman. O'rta Osiyo xalqlarining chor Rossiyasi zulmiga qarshi kurashi hamda inqilob arafasidagi ijtimoiy hayot ko'zgusi.",
    price: 30000, downloadCount: 1800, likeCount: 720,
    categorySlug: "uzbek-klassigi", authorSlug: "oybek",
    tags: ["Roman", "Tarixiy", "O'zbek adabiyoti", "Klassik"],
  },
  {
    title: "Navoiy",
    description: "Oybek tomonidan yozilgan tarixiy-biografik roman. Alisher Navoiyning hayoti, ijodi va insoniy fazilatlari, Temuriylar davridagi siyosat va madaniyat go'zal tarzda tasvirlangan.",
    price: 38000, downloadCount: 2100, likeCount: 890,
    categorySlug: "uzbek-klassigi", authorSlug: "oybek",
    tags: ["Roman", "Tarixiy", "O'zbek adabiyoti", "Klassik"],
  },
  {
    title: "Shum bola",
    description: "G'afur G'ulomning o'ziga xos kulgili va hazin qissasi. Muallif o'z bolalik xotiralarini badiiy obrazda qayta yaratib, XX asr boshi Toshkent hayotini jonlantiradi.",
    price: 25000, downloadCount: 3100, likeCount: 1300,
    categorySlug: "uzbek-klassigi", authorSlug: "gafur-gulom",
    tags: ["Qissa", "O'zbek adabiyoti", "Klassik"],
  },
  {
    title: "Xamsa",
    description: "Alisher Navoiyning besh dostondan iborat ulug' asari: Hayrat ul-abror, Farhod va Shirin, Layli va Majnun, Sab'ai sayyor, Saddi Iskandariy. O'zbek adabiyotining cho'qqisi.",
    price: 49000, downloadCount: 3800, likeCount: 1600,
    categorySlug: "uzbek-klassigi", authorSlug: "alisher-navoiy",
    tags: ["She'riyat", "O'zbek adabiyoti", "Klassik", "Falsafiy"],
  },
  {
    title: "Oydinda yurgan odamlar",
    description: "Tog'ay Murod qalamiga mansub lirik roman. O'zbek qishlog'i va uning odamlari hayoti, tabiat bilan uyg'unlikda yashash falsafasi nozik badiiy til bilan tasvirlangan.",
    price: 33000, downloadCount: 1600, likeCount: 640,
    categorySlug: "uzbek-klassigi", authorSlug: "togay-murod",
    tags: ["Roman", "O'zbek adabiyoti", "Klassik"],
  },
  {
    title: "O'rik ochilganda",
    description: "Shukur Xolmirzayevning hikoyalar to'plami. O'zbek qishlog'i odamlarining sodda, lekin chuqur ma'noli hayotlari, mehr-oqibat va insoniy munosabatlar nozik qalamda chizilgan.",
    price: 27000, downloadCount: 1200, likeCount: 490,
    categorySlug: "uzbek-klassigi", authorSlug: "shukur-xolmirzayev",
    tags: ["Hikoya", "O'zbek adabiyoti", "Klassik"],
  },

  // ── O'zbek she'riyati ──────────────────────────────────────────────────────
  {
    title: "Abdulla Oripov — Tanlangan she'rlar",
    description: "O'zbekistonning xalq shoiri Abdulla Oripovning eng sara she'rlari to'plami. Vatan, muhabbat, tabiat va insoniylik haqidagi lirik asarlar — o'zbek she'riyatining navqiron shabadasi.",
    price: 28000, downloadCount: 2700, likeCount: 1150,
    categorySlug: "sheriyat", authorSlug: "abdulla-oripov",
    tags: ["She'riyat", "O'zbek adabiyoti", "Klassik"],
  },
  {
    title: "Erkin Vohidov — Ruhlar isyoni",
    description: "Erkin Vohidovning buyuk dostoni. Ozodlik, inson qadr-qimmati va milliy ong haqida fikr yurituvchi bu asar o'zbek she'riyatining eng baland cho'qqilaridan biri sanaladi.",
    price: 30000, downloadCount: 1900, likeCount: 820,
    categorySlug: "sheriyat", authorSlug: "erkin-vohidov",
    tags: ["She'riyat", "O'zbek adabiyoti", "Falsafiy"],
  },
  {
    title: "Cho'lpon — Tong sirlari",
    description: "Cho'lponning she'rlar to'plami. Ozodlik, sevgi va tabiat haqidagi lirik asarlar — o'zbek she'riyatining yangilanish davri namunalari. Har bir misra ichki isyon va umid bilan to'la.",
    price: 0, downloadCount: 3200, likeCount: 1400,
    categorySlug: "sheriyat", authorSlug: "cholpon",
    tags: ["She'riyat", "O'zbek adabiyoti", "Klassik"],
  },

  // ── Jahon klassiği ─────────────────────────────────────────────────────────
  {
    title: "Urush va tinchlik",
    description: "Tolstoyning buyuk tetralogi. Napoleon urushi davrida to'rtta zodagon oila taqdirini, sevgi va o'lim, jasorat va qo'rqoqlik, urush va tinchlikning ma'nosini qamrab olgan jahon adabiyotining eng yirik asarlaridan biri.",
    price: 65000, downloadCount: 2800, likeCount: 1050,
    categorySlug: "jahon-klassigi", authorSlug: "lev-tolstoy",
    tags: ["Roman", "Tarixiy", "Jahon adabiyoti", "Tarjima", "Klassik"],
  },
  {
    title: "Anna Karenina",
    description: "Tolstoyning psixologik romani. Anna Kareninaning tragik sevgi qissasi orqali XIX asrdagi Rus jamiyatining axloqi, nikoh muassasasi va ijtimoiy normalar keskin tahlil qilinadi.",
    price: 55000, downloadCount: 2500, likeCount: 1100,
    categorySlug: "jahon-klassigi", authorSlug: "lev-tolstoy",
    tags: ["Roman", "Psixologik", "Jahon adabiyoti", "Tarjima", "Klassik"],
  },
  {
    title: "Jinoyat va jazo",
    description: "Dostoyevskiyning eng mashhur romani. Rodion Raskol'nikovning qotillik sodir etib, vijdon azobida qolishi — axloqiy tanlov, javobgarlik va ilohiy adolat haqida ulug' falsafiy asar.",
    price: 52000, downloadCount: 3100, likeCount: 1350,
    categorySlug: "jahon-klassigi", authorSlug: "fyodor-dostoyevskiy",
    tags: ["Roman", "Psixologik", "Falsafiy", "Jahon adabiyoti", "Tarjima", "Klassik"],
  },
  {
    title: "Idiot",
    description: "Dostoyevskiyning chuqur psixologik romani. Knyaz Mishkin — eng olijanob, eng sof yurakli inson — shafqatsiz dunyo bilan to'qnashuvda. Yaxshilik va go'zallik dunyoni qutqara oladimi?",
    price: 48000, downloadCount: 2300, likeCount: 980,
    categorySlug: "jahon-klassigi", authorSlug: "fyodor-dostoyevskiy",
    tags: ["Roman", "Psixologik", "Falsafiy", "Jahon adabiyoti", "Tarjima", "Klassik"],
  },
  {
    title: "Hamlet",
    description: "Shakespearening eng mashhur tragediyasi. Danimarkalik shahzoda Hamletning otasi qotilini topish va qasos olish yo'lidagi izlanishlari. 'Bo'lish yoki bo'lmaslik' — abadiy savol.",
    price: 32000, downloadCount: 3500, likeCount: 1500,
    categorySlug: "jahon-klassigi", authorSlug: "william-shakespeare",
    tags: ["Drama", "Falsafiy", "Jahon adabiyoti", "Tarjima", "Klassik"],
  },
  {
    title: "Romeo va Juletta",
    description: "Shakespearening o'lmas sevgi tragediyasi. Verona shahrida dushman ikki oila farzandlarining muhabbati — abadiy sevgi timsoli. To'rt yuz yildan ortiq vaqt davomida yuraklar to'lb kelgan asar.",
    price: 30000, downloadCount: 4100, likeCount: 1800,
    categorySlug: "jahon-klassigi", authorSlug: "william-shakespeare",
    tags: ["Drama", "Klassik", "Jahon adabiyoti", "Tarjima"],
  },
  {
    title: "Yuz yillik yolg'izlik",
    description: "García Márquezning Nobel mukofoti olgan asari. Makondo shahrida Buendiya oilasining yetti avlodi tarixi — sehrli realizm janrining shoh asari. Sevgi, vaqt va taqdirning ulug'vor qissasi.",
    price: 45000, downloadCount: 2700, likeCount: 1200,
    categorySlug: "jahon-klassigi", authorSlug: "gabriel-garcia-marquez",
    tags: ["Roman", "Fantastika", "Jahon adabiyoti", "Tarjima", "Klassik"],
  },
  {
    title: "Kichkina shahzoda",
    description: "Saint-Exupéryning dunyo bo'ylab yuz millionlab nusxada nashr etilgan asari. Bir bolaning sayyoralar kezib, muhabbat va do'stlik sirini izlashi — kattalar uchun bolalar ertagi.",
    price: 0, downloadCount: 5800, likeCount: 2400,
    categorySlug: "bolalar-adabiyoti", authorSlug: "antoine-de-saint-exupery",
    tags: ["Qissa", "Falsafiy", "Bolalar", "Jahon adabiyoti", "Tarjima"],
  },
  {
    title: "Metamorfoza",
    description: "Kafkaning eng mashhur qissasi. Bir kuni uyg'onib, hasharotga aylanib qolgan Gregori Zamza haqidagi bu asar — insonning chet qolib ketishi, oila va jamiyat bosimini ramziy tarzda ifodalaydi.",
    price: 29000, downloadCount: 2100, likeCount: 920,
    categorySlug: "jahon-klassigi", authorSlug: "franz-kafka",
    tags: ["Qissa", "Falsafiy", "Jahon adabiyoti", "Tarjima", "Klassik"],
  },
  {
    title: "Qari va dengiz",
    description: "Hemingwayning Nobel mukofotiga sazovor asari. Santiago — keksa baliqchi — dengizda ulkan marlinga duch keladi. Inson iroda va tabiat kuchi haqida sodda, lekin chuqur hikoya.",
    price: 25000, downloadCount: 2900, likeCount: 1250,
    categorySlug: "jahon-klassigi", authorSlug: "ernest-hemingway",
    tags: ["Qissa", "Sarguzasht", "Jahon adabiyoti", "Tarjima", "Klassik"],
  },
  {
    title: "Don Kixot",
    description: "Servantesin jahon adabiyotining birinchi zamonaviy romani. Ritsarlik romanlarini o'qib, o'zini ritsarman deb o'ylaydigan Don Kixotning sarguzashtlari — ham kulgili, ham falsafiy asar.",
    price: 55000, downloadCount: 1800, likeCount: 780,
    categorySlug: "jahon-klassigi", authorSlug: "miguel-de-cervantes",
    tags: ["Roman", "Sarguzasht", "Klassik", "Jahon adabiyoti", "Tarjima"],
  },
  {
    title: "Graf Monte-Kristo",
    description: "Dyumaning olis sarguzasht romani. Adolatsiz qoralangan Edmon Dantes o'n to'rt yil qamoqdan so'ng boylik va kuch bilan qaytib, qasos oladi. Adliya, sadoqat va qasos haqidagi sarguzasht epos.",
    price: 58000, downloadCount: 3400, likeCount: 1450,
    categorySlug: "jahon-klassigi", authorSlug: "alexandre-dumas",
    tags: ["Roman", "Sarguzasht", "Detektiv", "Jahon adabiyoti", "Tarjima", "Klassik"],
  },
];

const blogsData = [
  {
    title: "O'zbek adabiyotining oltin davri: XIX–XX asrlar",
    slug: "uzbek-adabiyotining-oltin-davri",
    content: `O'zbek adabiyotining XIX asrdan XX asrgacha bo'lgan davri haqiqiy uyg'onish davri bo'ldi.

Bu davrda Abdullah Qodiriy, Cho'lpon va Fitrat kabi daholar o'zbek romanchiligiga poydevor qo'ydi. Ularning asarlari nafaqat badiiy jihatdan, balki ijtimoiy va siyosiy jihatdan ham chuqur ahamiyat kasb etardi.

Abdullah Qodiriyning "O'tkan kunlar" romani (1922) o'zbek romanchiligida yangi sahifa ocha\ldı. Cho'lpon esa she'riyat va romanchilikda yangilik olib keldi.

Bu davr adabiyotining o'ziga xos xususiyatlari:
— Milliy o'zlikni anglash
— Tarixiy mavzularga murojaat
— Zamonaviy adabiy shakllar qabul qilish
— Ijtimoiy tanqid

Bu buyuk ijodkorlarning merosi bugun ham o'z ahamiyatini yo'qotmagan.`,
    excerpt: "XIX–XX asrlarda o'zbek adabiyotida yuz bergan ulkan burilishlar va bu davrning daholarini tanib oling.",
    readingTime: 6, status: "PUBLISHED",
    categorySlug: "uzbek-klassigi", authorSlug: "abdulla-oripov",
    tags: ["O'zbek adabiyoti", "Klassik", "Tarixiy"],
  },
  {
    title: "Dostoevskiy va ruhiyat: Psixologik roman ustasi",
    slug: "dostoevskiy-psixologik-roman-ustasi",
    content: `Fyodor Dostoevskiy zamonaviy psixologik romanchilikka poydevor qo'ygan yozuvchi sifatida tan olinadi.

Uning asarlarida inson ruhiyatining eng chuqur qatlamlari ochib beriladi. "Jinoyat va jazo"da Raskol'nikovning ichki dunyosi, "Idiot"da Mishkinning nodir fazilatlari, "Aka-uka Karamazovlar"da esa diniy-falsafiy savollar o'rtaga tashlanadi.

Dostoevskiyning asosiy mavzulari:
— Jinoyat va vijdon
— Erkinlik va mas'uliyat
— Din va ateizm
— Qashshoqlik va insoniy qadr-qimmat
— Ruhiy taqsimlanish

Uning romanlarini o'qish — insoniyat haqidagi eng chuqur savollarga javob izlashdir.`,
    excerpt: "Dostoevskiy qanday qilib inson ruhiyatini bu qadar chuqur tasvirlay olgan? Psixologik roman ustasining sirlarini bilib oling.",
    readingTime: 7, status: "PUBLISHED",
    categorySlug: "jahon-klassigi", authorSlug: "erkin-vohidov",
    tags: ["Roman", "Psixologik", "Falsafiy", "Jahon adabiyoti"],
  },
  {
    title: "Alisher Navoiyning Xamsa asarini tushunish",
    slug: "alisher-navoiy-xamsa-tahlil",
    content: `Alisher Navoiyning "Xamsa" asari besh dostondan iborat bo'lib, o'zbek adabiyotining cho'qqisini ifodalaydi.

Dostonlar:
1. Hayrat ul-abror — axloq va nasihat mavzusida
2. Farhod va Shirin — muhabbat va vafodorlik
3. Layli va Majnun — ilohiy ishq va devonavorlik
4. Sab'ai sayyor — yetti sayyora va yetti hikoya
5. Saddi Iskandariy — Iskandar Zulqarnayn haqida

Navoiy Xamsasini o'qish uchun tavsiyalar:
— Avvalo, qisqa sharh yoki muqaddima bilan tanishing
— Har bir dostonni alohida o'qing
— Tasvirlar va timsollarga e'tibor bering
— Falsafiy ma'nolarini izlang

Bu ulug' meros hamma zamonlar uchun yaratilgan.`,
    excerpt: "Navoiyning Xamsa asarini qanday o'qish va tushunish kerak? Besh dostonning sir-asrorlari.",
    readingTime: 8, status: "PUBLISHED",
    categorySlug: "uzbek-klassigi", authorSlug: "abdulla-oripov",
    tags: ["She'riyat", "O'zbek adabiyoti", "Klassik", "Falsafiy"],
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding boshlandi...\n");

  // Admin user
  const hashed = await bcrypt.hash(adminUser.password, 10);
  const admin = await prisma.user.upsert({
    where: { email: adminUser.email },
    update: {},
    create: { ...adminUser, password: hashed },
  });
  console.log(`👤 Admin: ${admin.email}`);

  // Root categories
  const categoryMap = {};
  for (const c of rootCategories) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description, parentId: null },
      create: { ...c, parentId: null },
    });
    categoryMap[c.slug] = cat;
    console.log(`📁 Kategoriya: ${cat.name}`);
  }

  // Sub-categories
  for (const s of subCategories) {
    const parent = categoryMap[s.parentSlug];
    const { parentSlug, ...subData } = s;
    const existing = await prisma.category.findFirst({
      where: { OR: [{ slug: subData.slug }, { name: subData.name }] },
    });
    let cat;
    if (existing) {
      cat = await prisma.category.update({
        where: { id: existing.id },
        data: { ...subData, parentId: parent?.id ?? null },
      });
    } else {
      cat = await prisma.category.create({
        data: { ...subData, parentId: parent?.id ?? null },
      });
    }
    categoryMap[cat.slug] = cat;
    console.log(`  📚 Subkategoriya: ${cat.name}`);
  }

  // Authors
  const authorMap = {};
  for (const a of authors) {
    const author = await prisma.author.upsert({
      where: { slug: a.slug },
      update: { name: a.name, bio: a.bio },
      create: a,
    });
    authorMap[a.slug] = author;
    console.log(`✍️  Muallif: ${author.name}`);
  }

  // Tags
  const tagMap = {};
  for (const t of tags) {
    const tag = await prisma.tag.upsert({
      where: { slug: t.slug },
      update: {},
      create: t,
    });
    tagMap[t.name] = tag;
    console.log(`🏷️  Teg: ${tag.name}`);
  }

  // Books
  for (const b of booksData) {
    const { tags: bookTags, categorySlug, authorSlug, ...bookData } = b;
    const existing = await prisma.book.findFirst({ where: { title: bookData.title } });
    let book;
    if (existing) {
      book = existing;
      console.log(`📚 Mavjud: ${book.title}`);
    } else {
      book = await prisma.book.create({
        data: {
          ...bookData,
          pdfUrl: "",
          categoryId: categoryMap[categorySlug]?.id ?? null,
          authorId: authorMap[authorSlug]?.id ?? null,
        },
      });
      console.log(`📚 Kitob: ${book.title} — ${book.price === 0 ? "BEPUL" : book.price.toLocaleString() + " so'm"}`);
    }

    for (const tagName of (bookTags || [])) {
      const tag = tagMap[tagName];
      if (tag) {
        await prisma.bookTag.upsert({
          where: { bookId_tagId: { bookId: book.id, tagId: tag.id } },
          update: {},
          create: { bookId: book.id, tagId: tag.id },
        });
      }
    }
  }

  // Blogs
  for (const b of blogsData) {
    const { tags: blogTags, categorySlug, authorSlug, ...blogData } = b;
    const existing = await prisma.blog.findUnique({ where: { slug: blogData.slug } });
    if (existing) { console.log(`📝 Mavjud blog: ${blogData.title}`); continue; }

    const blog = await prisma.blog.create({
      data: {
        ...blogData,
        categoryId: categoryMap[categorySlug]?.id ?? null,
        authorId: authorMap[authorSlug]?.id ?? null,
      },
    });

    for (const tagName of (blogTags || [])) {
      const tag = tagMap[tagName];
      if (tag) {
        await prisma.blogTag.upsert({
          where: { blogId_tagId: { blogId: blog.id, tagId: tag.id } },
          update: {},
          create: { blogId: blog.id, tagId: tag.id },
        });
      }
    }
    console.log(`📝 Blog: ${blog.title}`);
  }

  console.log("\n✅ Seeding muvaffaqiyatli yakunlandi!");
  console.log("Admin: admin@bookstore.com / admin123");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
