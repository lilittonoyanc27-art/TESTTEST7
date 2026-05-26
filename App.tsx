import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  HelpCircle, 
  Volume2, 
  Award, 
  Trophy, 
  BookMarked, 
  ChevronRight, 
  Compass, 
  MessageSquare, 
  Sparkles, 
  Check, 
  FileText,
  Speech,
  Notebook,
  AlertCircle
} from 'lucide-react';

// UI Texts in Armenian (ARM) and Russian (RUS)
const TRANSLATIONS = {
  arm: {
    title: "Իսպաներենի Ուսուցման Խաղ",
    subtitle: "Հայերենից Իսպաներեն աքսելերատոր",
    grammarQuiz: "Քերականության Թեստ",
    readingStory: "ԻՍԿ ՀԻՄԱ ԼՍԵՆՔ...",
    audioGames: "Աուդիո Խաղեր",
    oralAssistant: "Բանավոր Խոսք",
    dictionary: "Իմ Բառարան",
    score: "Միավորներ",
    correctRate: "Ճիշտ պատասխաններ",
    resetBtn: "Վերասկսել",
    explanation: "Բացատրություն",
    correct: "Ճիշտ է:",
    incorrect: "Սխալ է:",
    whyTitle: "Ինչու՞ է սա ճիշտ",
    next: "Հաջորդը",
    prev: "Նախորդը",
    congrats: "Շնորհավորում ենք:",
    completedText: "Դուք հաջողությամբ անցաք բոլոր վարժությունները:",
    speakBtn: "Լսել արտասանությունը",
    vocabulary: "Բառապաշար",
    textTitle: "Երկխոսություն՝ «Tengo ganas de salir» (Դուրս գալու ցանկություն ունեմ)",
    presentationChecklist: "Բանավոր Ներկայացման Ուղեցույց (1-2 րոպե)",
    presentationDesc: "Փորձեք պատասխանել այս հարցերին իսպաներենով:",
    viewSample: "Տեսնել օրինակը",
    userNotes: "Ձեր նշումները / պատասխանի սևագիրը",
    placeholderNotes: "Գրեք ձեր պատասխանը այստեղ՝ մարզելու համար ձեր գրավոր իսպաներենը...",
    studyGoals: "Ուսումնական նպատակներ",
    streak: "Օրերի հաջորդականություն",
    level: "Մակարդակ",
    clickToSeeExplanation: "Պատասխանեք հարցին՝ բացատրությունը տեսնելու համար:",
    addWord: "Ավելացնել նոր բառ",
    wordPlholder: "Բառ (իսպաներեն)",
    translationPlholder: "Թարգմանություն",
    addBtn: "Ավելացնել",
    aiTutorFeedback: "Թյութորի աջակցություն",
    generateAIFeedback: "Վերլուծել պատասխանը",
    audioInstructions: "Լսեք աուդիոն և ընտրեք ճիշտ պատասխանը",
    playAudioBtn: "Նվագարկել աուդիոն",
    revealTextBtn: "Ցուցադրել տեքստը",
    dialogueInstructions: "💡 Սեղմեք նախադասությունների վրա՝ հայերեն թարգմանությունը տեսնելու համար"
  },
  rus: {
    title: "Игра по испанскому языку",
    subtitle: "Интерактивный тренажер испанского",
    grammarQuiz: "Грамматический тест",
    readingStory: "А ТЕПЕРЬ ПОСЛУШАЕМ...",
    audioGames: "Аудио-игры",
    oralAssistant: "Устная практика",
    dictionary: "Мой Словарь",
    score: "Очки",
    correctRate: "Точность",
    resetBtn: "Сбросить прогресс",
    explanation: "Объяснение",
    correct: "Правильно!",
    incorrect: "Неверно!",
    whyTitle: "Почему это правильно",
    next: "Дальше",
    prev: "Назад",
    congrats: "Поздравляем!",
    completedText: "Вы успешно завершили все упражнения курса!",
    speakBtn: "Прослушать произношение",
    vocabulary: "Словарь раздела",
    textTitle: "Диалог: «Tengo ganas de salir» (Хочу пойти погулять)",
    presentationChecklist: "План устной презентации (на 1-2 минуты)",
    presentationDesc: "Попробуйте ответить на эти вопросы на испанском языке.",
    viewSample: "Посмотреть образец",
    userNotes: "Ваши заметки / черновик ответа",
    placeholderNotes: "Напишите свой ответ здесь, чтобы попрактиковаться в письме...",
    studyGoals: "Учебные цели",
    streak: "Ударный режим",
    level: "Уровень",
    clickToSeeExplanation: "Ответьте на вопрос, чтобы увидеть подробное объяснение.",
    addWord: "Добавить новое слово",
    wordPlholder: "Слово (исп.)",
    translationPlholder: "Перевод",
    addBtn: "Добавить",
    aiTutorFeedback: "Помощь AI-Тьютора",
    generateAIFeedback: "Проанализировать ответ с помощью AI",
    audioInstructions: "Прослушайте аудио и выберите правильный ответ",
    playAudioBtn: "Воспроизвести аудио",
    revealTextBtn: "Показать текст",
    dialogueInstructions: "💡 Нажмите на предложение, чтобы увидеть перевод на армянский"
  }
};

// 10 Core Grammar Questions with English/Spanish metadata and explanations in Armenian and Russian
const GRAMMAR_QUESTIONS = [
  {
    id: 1,
    question: "1. Yo ... estudiante.",
    options: ["estoy", "soy", "es"],
    correctAnswerIndex: 1, // soy
    explanation: {
      arm: "«Soy» (ser բայը) օգտագործվում է մշտական հատկանիշների դեպքում, ինչպիսիք են մասնագիտությունը, ազգությունը կամ կարգավիճակը (ես ուսանող եմ): «Estoy»-ը (estar բայը) օգտագործվում է ժամանակավոր վիճակների կամ տեղակայման համար («estoy en casa»): «Es»-ը երրորդ դեմքն է (նա է):",
      rus: "«Soy» (от глагола ser) используется для постоянных характеристик, таких как профессия или статус (я студент). «Estoy» (от глагола estar) выражает временное состояние или местонахождение (например, «estoy en casa»). «Es» — это форма третьего лица единственного числа (он/она есть)."
    }
  },
  {
    id: 2,
    question: "2. Mi madre tiene ... años",
    options: ["cuarenta y un", "quarenta y un", "cuarenta y uno"],
    correctAnswerIndex: 0, // cuarenta y un
    explanation: {
      arm: "Արական սեռի գոյականների դեպքում (años - տարիներ) «cuarenta y uno»-ն կրճատվում է և դառնում է «cuarenta y un»: «Quarenta» տարբերակը ուղղագրական սխալ է, քանի որ իսպաներենում այն միշտ գրվում է «c» տառով:",
      rus: "Перед существительными мужского рода (например, años — годы) числительное «cuarenta y uno» усекается до «cuarenta y un». Вариант «quarenta» ошибочен орфографически, так как в испанском языке пишется через букву «c»."
    }
  },
  {
    id: 3,
    question: "3. Mis amigos ahora ... en Francia",
    options: ["son", "están", "hay"],
    correctAnswerIndex: 1, // están
    explanation: {
      arm: "«Están»-ը (estar բայի հոգնակի ձևը) օգտագործվում է ֆիզիկական կամ աշխարհագրական գտնվելու վայրը նշելու համար (իմ ընկերներն այժմ Ֆրանսիայում են): «Son»-ն օգտագործվում է ծագումը կամ էական հատկանիշները նկարագրելու համար («son franceses»): «Hay»-ը նշանակում է անդեմ «կա/կան»:",
      rus: "Форма «están» (глагол estar) используется для указания географического нахождения субъектов (мои друзья сейчас во Франции). «Son» (глагол ser) выражает происхождение или постоянные качества. «Hay» означает безличную форму «имеется/есть»."
    }
  },
  {
    id: 4,
    question: "4. A mí me ... las rosas blancas",
    options: ["gusta", "gusto", "gustan"],
    correctAnswerIndex: 2, // gustan
    explanation: {
      arm: "Քանի որ այն ամենը, ինչ դուր է գալիս, հոգնակի թվով է (las rosas blancas - սպիտակ վարդերը), «gustar» բայը պետք է համաձայնեցվի հոգնակի թվով՝ «gustan»: «Gusta»-ն օգտագործվում է եզակի թվով գոյականների կամ բայերի անորոշ դերբայի հետ:",
      rus: "Так как подлежащее выражено множественным числом (las rosas blancas — белые розы), глагол согласуется во множественном числе — «gustan». Форма «gusta» используется только с единственным числом или инфинитивами."
    }
  },
  {
    id: 5,
    question: "5. Mi hija trabaja ...",
    options: ["muy", "mucho", "mucha"],
    correctAnswerIndex: 1, // mucho
    explanation: {
      arm: "«Trabaja mucho» (շատ է աշխատում) արտահայտության մեջ «mucho»-ն հանդես է գալիս որպես մակբայ, ուստի անփոփոխ է: «Mucha»-ն իգական սեռի ածական է և պահանջում է գոյական («mucha paciencia»): «Muy»-ն նշանակում է «շատ» և դրվում է միայն ածականների կամ այլ մակբայների հետևից («muy inteligente»):",
      rus: "В значении «работает много» используется наречие «mucho», которое неизменяемо. «Mucha» — это женский род прилагательного (требует существительное, например: mucha paciencia). «Muy» переводится как «очень» и употребляется только перед прилагательными или наречиями (например, muy bien)."
    }
  },
  {
    id: 6,
    question: "6. Me gusta beber agua ...",
    options: ["fría", "frío", "frio"],
    correctAnswerIndex: 0, // fría
    explanation: {
      arm: "«Agua»-ն (ջուր) իգական սեռի գոյական է: Չնայած այն հանգամանքին, որ եզակի թվում օգտագործվում է արական «el» հոդը (el agua) երկու «ա»-երի բախումից խուսափելու համար, դրան ուղեկցող ածականները միշտ պահպանում են իգական սեռը՝ «fría» (սառը ջուր):",
      rus: "Существительное «agua» (вода) женского рода. Хотя в единственном числе из-за стыка гласных используется артикль мужского рода «el» (el agua), согласуемые прилагательные всегда стоят в женском роде — «fría». «Frío» — мужской род."
    }
  },
  {
    id: 7,
    question: "7. El reloj está ... de la puerta.",
    options: ["sobre", "en", "encima"],
    correctAnswerIndex: 2, // encima
    explanation: {
      arm: "«Encima»-ն միշտ զուգակցվում է «de» նախդիրի հետ («encima de la puerta» - դռան վերևում): sobre նշանակում է՝ վրա, երբ առարկան դրված է ինչ-որ մակերեսի վրա։",
      rus: "Предлог «encima» используется в устойчивом сочетании со связкой «de» («encima de...» — над/поверх чего-то). Предлог «sobre» означает «на/над», когда предмет находится на поверхности."
    }
  },
  {
    id: 8,
    question: "8. Los niños ... en el parque",
    options: ["están", "hay", "tienen"],
    correctAnswerIndex: 0, // están
    explanation: {
      arm: "«Están» (estar բայը) օգտագործվում է որոշակի սուբյեկտների (երեխաները) գտնվելու վայրը նշելու համար: «Hay»-ը նշանակում է անորոշ առարկաների գոյություն և երբեք չի օգտագործվում որոշյալ հոդից հետո («los niños»): «Tienen» նշանակում է «ունեն»:",
      rus: "Глагол «están» (estar) используется для выражения нахождения конкретных определенных субъектов в пространстве (дети в парке). Безличная форма «hay» никогда не используется после существительных с определенным артиклем (los niños). «Tienen» означает «имеют»."
    }
  },
  {
    id: 9,
    question: "9. En la habitación hay ... cama",
    options: ["la", "una", "el"],
    correctAnswerIndex: 1, // una
    explanation: {
      arm: "«Hay» (կա/կան) բայաձևից հետո միշտ օգտագործվում է անորոշ հոդ («una»), երբ խոսվում է առարկայի գոյության մասին: «Cama»-(ն) (մահճակալ) իգական սեռի եզակի գոյական է: Որոշյալ հոդերը («la», «el») «hay»-ից հետո չեն օգտագործվում:",
      rus: "После безличного глагола «hay» (имеется) используется неопределенный артикль («una»), когда речь идет о наличии предмета. «Cama» (кровать) — существительное женского рода. Определенные артикли («la», «el») после «hay» не ставятся."
    }
  },
  {
    id: 10,
    question: "10. A mi hermana menor no le gustan los teatros",
    options: ["a mí tampoco", "a mí tampoco no", "a mí también"],
    correctAnswerIndex: 0, // a mí tampoco
    explanation: {
      arm: "Ժխտական նախադասությանը համաձայնություն արտահայտելու համար (իմ քրոջը դուր չեն գալիս թատրոնները, ինձ նույնպես) օգտագործվում է կայուն «a mí tampoco» արտահայտությունը: «A mí tampoco no»-ն սխալ է (կրկնակի ժխտում): «A mí también»-ն օգտագործվում է հաստատման հետ համաձայնվելու դեպքում (ինձ նույնպես):",
      rus: "Для выражения согласия с отрицательным утверждением (моей сестре не нравятся театры, и мне тоже) употребляется устойчивая формула «a mí tampoco» (мне тоже нет). Вариант «a mí tampoco no» ошибочен из-за двойного отрицания. «A mí также но» не употребляется. «A mí también» используется для согласия с утверждением."
    }
  }
];

// Dialogue lines representation for interactive click translations
const DIALOGUE_LINES = [
  {
    id: 1,
    speaker: "Oleg",
    text: "Oleg: ¡Hola, María! Tengo ganas de salir este fin de semana. ¿Tienes planes?",
    translation: "Oleg: Ողջույն, Մարիա: Այս հանգստյան օրերին դուրս գալու ցանկություն ունեմ: Պլաններ ունե՞ս:"
  },
  {
    id: 2,
    speaker: "María",
    text: "María: ¡Hola! Pues... no muchos. ¿Qué te parece si vamos a algún restaurante nuevo?",
    translation: "María: Ողջույն: Դե... ոչ այնքան: И՞նչ կասես, եթե գնանք ինչ-որ նոր ռեստորան:"
  },
  {
    id: 3,
    speaker: "Oleg",
    text: "Oleg: Me gustaría, sí. A mí me parece que el centro tiene sitios muy buenos.",
    translation: "Oleg: Կցանկանայի, այո: Ինձ թվում է, որ կենտրոնում շատ լավ վայրեր կան:"
  },
  {
    id: 4,
    speaker: "María",
    text: "María: Bueno, depende... yo necesito un sitio tranquilo. No me apetece mucho ruido.",
    translation: "María: Դե, նայած... ինձ հանգիստ վայր է պետք: Աղմուկի տրամադրություն չունեմ:"
  },
  {
    id: 5,
    speaker: "Oleg",
    text: "Oleg: No te preocupes, yo conozco un lugar perfecto. Pequeño, tranquilo, buena comida.",
    translation: "Oleg: Մի՛ անհանգստացիր, ես մի կատարյալ տեղ գիտեմ: Փոքր է, հանգիստ, լավ սնունդով:"
  },
  {
    id: 6,
    speaker: "María",
    text: "María: ¡Genial! Lo que más me gusta es descubrir sitios nuevos. ¿A qué hora quedamos?",
    translation: "María: Հիանալի է: Ամենից շատ սիրում եմ նոր վայրեր բացահայտել: Ժամը քանիսի՞ն հանդիպենք:"
  },
  {
    id: 7,
    speaker: "Oleg",
    text: "Oleg: ¿Qué te parece si quedamos a las dos?",
    translation: "Oleg: Ի՞նչ կասես, եթե հանդիպենք ժամը երկուսին:"
  },
  {
    id: 8,
    speaker: "María",
    text: "María: A mí me parece bien, pero necesito salir antes de casa. Hay que coger el metro.",
    translation: "María: Ինձ համար հարմար է, բայց պետք է տանից շուտ դուրս գամ: Պետք է մետրո նստել:"
  },
  {
    id: 9,
    speaker: "Oleg",
    text: "Oleg: No pasa nada, sin prisa. ¡Nos vemos el sábado!",
    translation: "Oleg: Ոչինչ, առանց շտապելու: Կհանդիպենք շաբաթ օրը:"
  },
  {
    id: 10,
    speaker: "María",
    text: "María: ¡Perfecto! ¡Hasta el sábado, Oleg!",
    translation: "María: Հրաշալի է: Մինչ շաբաթ, Օլեգ:"
  }
];

// Dialogue Quiz Questions of Oleg & María
const DIALOGUE_QUESTIONS = [
  {
    id: 11,
    question: "1. Oleg quiere salir...",
    options: ["entre semana", "este fin de semana", "mañana por la mañana"],
    correctAnswerIndex: 1, // este fin de semana
    explanation: {
      arm: "Օլեգն ասում է. «Tengo ganas de salir este fin de semana» (Այս հանգստյան օրերին դուրս գալու ցանկություն ունեմ):",
      rus: "Олег говорит: «Tengo ganas de salir este fin de semana» (Я хочу выбраться куда-нибудь в эти выходные)."
    }
  },
  {
    id: 12,
    question: "2. Oleg pregunta a María si tiene...",
    options: ["dinero", "planes", "hambre"],
    correctAnswerIndex: 1, // planes
    explanation: {
      arm: "Օլեգը հարցնում է. «¿Tienes planes?» (Պլաններ ունե՞ս):",
      rus: "Олег спрашивает у Марии: «¿Tienes planes?» (Есть ли у тебя планы?)."
    }
  },
  {
    id: 13,
    question: "3. María propone ir a...",
    options: ["un restaurante nuevo", "una tienda nueva", "un parque nuevo"],
    correctAnswerIndex: 0, // un restaurante nuevo
    explanation: {
      arm: "Մարիան առաջարկում է. «¿Qué te parece si vamos a algún restaurante nuevo?» (Ի՞նչ կասես, եթե գնանք ինչ-որ նոր ռեստորան):",
      rus: "Мария предлагает: «¿Qué te parece si vamos a algún restaurante nuevo?» (Как насчет того, чтобы пойти в какой-нибудь новый ресторан?)."
    }
  },
  {
    id: 14,
    question: "4. Oleg cree que en el centro hay...",
    options: ["muchos museos", "sitios muy buenos", "mucho ruido"],
    correctAnswerIndex: 1, // sitios muy buenos
    explanation: {
      arm: "Օլեգն ասում է. «A mí me parece que el centro tiene sitios muy buenos» (Ինձ թվում է, որ կենտրոնում շատ լավ վայրեր կան):",
      rus: "Олег говорит: «A mí me parece que el centro tiene sitios muy buenos» (Мне кажется, в центре есть очень хорошие места)."
    }
  },
  {
    id: 15,
    question: "5. María necesita un sitio...",
    options: ["grande", "tranquilo", "caro"],
    correctAnswerIndex: 1, // tranquilo
    explanation: {
      arm: "Մարիան ասում է. «...yo necesito un sitio tranquilo» (ինձ հանգիստ վայր է պետք):",
      rus: "Мария говорит: «...yo necesito un sitio tranquilo» (мне нужно спокойное место)."
    }
  },
  {
    id: 16,
    question: "6. A María no le apetece...",
    options: ["mucho ruido", "comida italiana", "ir al cine"],
    correctAnswerIndex: 0, // mucho ruido
    explanation: {
      arm: "Մարիան նշում է. «No me apetece mucho ruido» (Աղմուկի տրամադրություն չունեմ):",
      rus: "Мария говорит: «No me apetece mucho ruido» (Мне не хочется много шума)."
    }
  },
  {
    id: 17,
    question: "7. Oleg conoce un lugar...",
    options: ["perfecto", "muy caro", "lejos del centro"],
    correctAnswerIndex: 0, // perfecto
    explanation: {
      arm: "Օլեգն ասում է. «...yo conozco un lugar perfecto» (ես մի կատարյալ տեղ գիտեմ):",
      rus: "Олег утверждает: «...yo conozco un lugar perfecto» (я знаю идеальное место)."
    }
  },
  {
    id: 18,
    question: "8. El lugar que conoce Oleg es...",
    options: ["pequeño y tranquilo", "grande y moderno", "ruidoso y famoso"],
    correctAnswerIndex: 0, // pequeño y tranquilo
    explanation: {
      arm: "Օլեգը նկարագրում է վայրը որպես. «Pequeño, tranquilo, buena comida» (Փոքր է, հանգիստ, լավ սնունդով):",
      rus: "Олег описывает его: «Pequeño, tranquilo, buena comida» (Маленькое, тихое, с вкусной едой)."
    }
  },
  {
    id: 19,
    question: "9. A María le gusta descubrir...",
    options: ["tiendas nuevas", "sitios nuevos", "libros nuevos"],
    correctAnswerIndex: 1, // sitios nuevos
    explanation: {
      arm: "Մարիան բացականչում է. «Lo que más me gusta es descubrir sitios nuevos» (Ամենից շատ սիրում եմ նոր վայրեր բացահայտել):",
      rus: "Мария говорит: «Lo que más me gusta es descubrir sitios nuevos» (Больше всего мне нравится открывать новые места)."
    }
  },
  {
    id: 20,
    question: "10. Oleg y María quedan...",
    options: ["a las dos", "a las tres", "a las diez"],
    correctAnswerIndex: 0, // a las dos
    explanation: {
      arm: "Օլեգն առաջարկում է, իսկ Մարիան համաձայնում է. «¿Qué te parece si quedamos a las dos?» - «A mí me parece bien...» (Ի՞նչ կասեց, եթե հանդիպենք ժամը երկուսին: - Ինձ համար հարմար է...):",
      rus: "Олег предлагает, а Мария соглашается: «¿Qué te parece si quedamos a las dos?» (А встретимся в два часа?)."
    }
  }
];

// Five Listening Audio Games
const AUDIO_GAMES = [
  {
    id: 1,
    audioText: "María estudia ecología y cocina pasta deliciosa.",
    question: {
      arm: "Ի՞նչ է ուսումնասիրում Մարիան:",
      rus: "Что изучает Мария?"
    },
    options: {
      arm: ["բժշկություն (medicina)", "էկոլոգիա (ecología)", "երաժշտություն (música)"],
      rus: ["медицина (medicina)", "экология (ecología)", "музыка (música)"]
    },
    correctAnswerIndex: 1,
    explanation: {
      arm: "Մարիան ուսումնասիրում է էկոլոգիա: Աուդիոյում ասվում է. «María estudia ecología...»:",
      rus: "Мария изучает экологию. В аудио говорится: «María estudia ecología...»."
    }
  },
  {
    id: 2,
    audioText: "Oleg va al cine los sábados por la tarde.",
    question: {
      arm: "Ո՞ւր է գնում Օլեգը շաբաթ օրերին:",
      rus: "Куда ходит Олег по субботам?"
    },
    options: {
      arm: ["կինոթատրոն (al cine)", "այգի (al parque)", "ռեստորան (al restaurante)"],
      rus: ["в кино (al cine)", "в парк (al parque)", "в ресторан (al restaurante)"]
    },
    correctAnswerIndex: 0,
    explanation: {
      arm: "Օլեգը գնում է կինոթատրոն: Աուդիոյում լսում ենք. «Oleg va al cine los sábados...»:",
      rus: "Олег ходит в кино. В аудио мы слышим: «Oleg va al cine los sábados...»."
    }
  },
  {
    id: 3,
    audioText: "Me gusta tomar el café sin azúcar, pero con leche fría.",
    question: {
      arm: "Ինչպե՞ս է նա սիրում խմել սուրճը:",
      rus: "Как он/она любит пить кофе?"
    },
    options: {
      arm: ["շաքարավազով (con azúcar)", "առանց շաքարավազի, բայց կաթով (sin azúcar, pero con leche)", "շոկոլադով (con chocolate)"],
      rus: ["с сахаром (con azúcar)", "без сахара, но с молоком (sin azúcar, pero con leche)", "с шоколадом (con chocolate)"]
    },
    correctAnswerIndex: 1,
    explanation: {
      arm: "Սուրճը խմում է առանց շաքարավազի, բայց կաթով: «...sin azúcar, pero con leche fría.»",
      rus: "Кофе без сахара, но с молоком: «...sin azúcar, pero con leche fría.»"
    }
  },
  {
    id: 4,
    audioText: "El apartamento de María es muy luminoso, pero no tiene terraza.",
    question: {
      arm: "Ի՞նչ չունի Մարիայի բնակարանը:",
      rus: "Чего нет в квартире Марии?"
    },
    options: {
      arm: ["մեծ պատուհաններ (ventanas grandes)", "պատշգամբ (terraza)", "խոհանոց (cocina)"],
      rus: ["большие окна (ventanas grandes)", "терраса (terraza)", "кухня (cocina)"]
    },
    correctAnswerIndex: 1,
    explanation: {
      arm: "Բնակարանը չունի պատշգամբ (terraza): Աուդիոյում ասվում է. «...pero no tiene terraza»:",
      rus: "В квартире нет террасы (terraza). В аудио говорится: «...pero no tiene terraza»."
    }
  },
  {
    id: 5,
    audioText: "El metro de Madrid es muy rápido y cómodo para viajar.",
    question: {
      arm: "Ինչպիսի՞ն է Մադրիդի մետրոն:",
      rus: "Какое метро в Мадриде?"
    },
    options: {
      arm: ["դանդաղ և ձանձրալի (lento y aburrido)", "աղմկոտ և թանկ (ruidoso y caro)", "արագ և հարմարավետ (rápido y cómodo)"],
      rus: ["медленное и скучное (lento y aburrido)", "шумное и дорогое (ruidoso y caro)", "быстрое и удобное (rápido y cómodo)"]
    },
    correctAnswerIndex: 2,
    explanation: {
      arm: "Մետրոն արագ է և հարմարավետ («rápido y cómodo»):",
      rus: "Метро быстрое и комфортное («rápido и cómodo»)."
    }
  }
];

// Local Storage Keys
const SCORE_STORAGE_KEY = "spanish_learning_game_scores";
const PROGRESS_STORAGE_KEY = "spanish_learning_game_progress_v1";

export default function App() {
  const [lang, setLang] = useState<'arm' | 'rus'>('arm');
  const [largeFont, setLargeFont] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'grammar' | 'reading' | 'audio' | 'oral' | 'dictionary'>('grammar');
  
  // Progress states for Grammar
  const [grammarAnswers, setGrammarAnswers] = useState<Record<number, number>>({});
  const [visibleGrammarExplanations, setVisibleGrammarExplanations] = useState<Record<number, boolean>>({});

  // Progress states for Dialogue (replaces Sofia)
  const [dialogueAnswers, setDialogueAnswers] = useState<Record<number, number>>({});
  const [visibleDialogueExplanations, setVisibleDialogueExplanations] = useState<Record<number, boolean>>({});
  const [dialogueLinesTranslation, setDialogueLinesTranslation] = useState<Record<number, boolean>>({});

  // Progress states for Audio Games
  const [audioAnswers, setAudioAnswers] = useState<Record<number, number>>({});
  const [visibleAudioExplanations, setVisibleAudioExplanations] = useState<Record<number, boolean>>({});
  const [revealedAudioTexts, setRevealedAudioTexts] = useState<Record<number, boolean>>({});

  // Oral Practice selected card
  const [selectedOralCard, setSelectedOralCard] = useState<number | null>(null);
  const [userSpeechDraft, setUserSpeechDraft] = useState<string>("");
  const [aiFeedbackText, setAiFeedbackText] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Custom Dictionary words
  const [customWords, setCustomWords] = useState<{word: string, translation: string}[]>([
    { word: "apetece", translation: "хочется, тянет / տրամադրություն ունենալ, հակում ունենալ" },
    { word: "quedar", translation: "встречаться, договариваться / հանդիպել, պայմանավորվել" },
    { word: "coger", translation: "ловить, садиться в транспорт / բռնել, նստել" },
    { word: "sin prisa", translation: "без спешки / առանց շտապելու" },
    { word: "cómoda", translation: "удобная / հարմարավետ" },
    { word: "acogedora", translation: "уютная / հյուրընկալ" },
    { word: "piso", translation: "квартира / բնակարան" },
    { word: "libre", translation: "свободный / ազատ" },
    { word: "bici (bicicleta)", translation: "велосипед / հեծանիվ" },
    { word: "excursión", translation: "экскурсия / արշավ" }
  ]);
  const [newWord, setNewWord] = useState("");
  const [newTranslation, setNewTranslation] = useState("");

  const t = TRANSLATIONS[lang];

  // Load progress on start
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress);
        if (parsed.grammarAnswers) setGrammarAnswers(parsed.grammarAnswers);
        if (parsed.visibleGrammarExplanations) setVisibleGrammarExplanations(parsed.visibleGrammarExplanations);
        if (parsed.dialogueAnswers) {
          setDialogueAnswers(parsed.dialogueAnswers);
        } else if (parsed.sofiaAnswers) {
          setDialogueAnswers(parsed.sofiaAnswers);
        }
        if (parsed.visibleDialogueExplanations) {
          setVisibleDialogueExplanations(parsed.visibleDialogueExplanations);
        } else if (parsed.visibleSofiaExplanations) {
          setVisibleDialogueExplanations(parsed.visibleSofiaExplanations);
        }
        if (parsed.audioAnswers) setAudioAnswers(parsed.audioAnswers);
        if (parsed.visibleAudioExplanations) setVisibleAudioExplanations(parsed.visibleAudioExplanations);
        if (parsed.revealedAudioTexts) setRevealedAudioTexts(parsed.revealedAudioTexts);
        if (parsed.customWords) setCustomWords(parsed.customWords);
        if (parsed.userSpeechDraft) setUserSpeechDraft(parsed.userSpeechDraft);
        if (parsed.lang) setLang(parsed.lang);
      }
    } catch (e) {
      console.error("Failed to load local storage state", e);
    }
  }, []);

  // Save progress on state change
  useEffect(() => {
    try {
      const stateToSave = {
        grammarAnswers,
        visibleGrammarExplanations,
        dialogueAnswers,
        visibleDialogueExplanations,
        audioAnswers,
        visibleAudioExplanations,
        revealedAudioTexts,
        customWords,
        userSpeechDraft,
        lang
      };
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error("Failed to save state to local storage", e);
    }
  }, [grammarAnswers, visibleGrammarExplanations, dialogueAnswers, visibleDialogueExplanations, audioAnswers, visibleAudioExplanations, revealedAudioTexts, customWords, userSpeechDraft, lang]);

  // Handle Option Click
  const handleGrammarOptionClick = (questionId: number, optionIndex: number) => {
    // Save selected answer if not answered yet
    if (grammarAnswers[questionId] !== undefined) return;

    setGrammarAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));

    // Instantly show explanation only after making a selection
    setVisibleGrammarExplanations(prev => ({
      ...prev,
      [questionId]: true
    }));
  };

  const handleDialogueOptionClick = (questionId: number, optionIndex: number) => {
    // Save selected answer if not answered yet
    if (dialogueAnswers[questionId] !== undefined) return;

    setDialogueAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));

    // Instantly show explanation only after making a selection
    setVisibleDialogueExplanations(prev => ({
      ...prev,
      [questionId]: true
    }));
  };

  const handleAudioOptionClick = (gameId: number, optionIndex: number) => {
    if (audioAnswers[gameId] !== undefined) return;

    setAudioAnswers(prev => ({
      ...prev,
      [gameId]: optionIndex
    }));

    setVisibleAudioExplanations(prev => ({
      ...prev,
      [gameId]: true
    }));
  };

  // Text Pronunciation helper via Web Speech API
  const speakText = (textToSpeak: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'es-ES';
      utterance.rate = 0.85; // slightly slower for learners
      window.speechSynthesis.cancel(); // stop current utterance
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Speech synthesis is not supported on your browser.");
    }
  };

  // Add word to client custom dictionary
  const handleAddWord = (e: FormEvent) => {
    e.preventDefault();
    if (!newWord.trim() || !newTranslation.trim()) return;
    setCustomWords(prev => [
      { word: newWord.trim().toLowerCase(), translation: newTranslation.trim() },
      ...prev
    ]);
    setNewWord("");
    setNewTranslation("");
  };

  // Reset core states
  const handleResetProgress = () => {
    if (window.confirm(lang === 'arm' ? "Ցանկանու՞մ եք վերսկսել խաղը և ջնջել ձեր արդյունքները:" : "Вы уверены, что хотите сбросить весь прогресс?")) {
      setGrammarAnswers({});
      setVisibleGrammarExplanations({});
      setDialogueAnswers({});
      setVisibleDialogueExplanations({});
      setDialogueLinesTranslation({});
      setAudioAnswers({});
      setVisibleAudioExplanations({});
      setRevealedAudioTexts({});
      setUserSpeechDraft("");
      setAiFeedbackText("");
      // Keep custom words but reset answers
      localStorage.removeItem(PROGRESS_STORAGE_KEY);
    }
  };

  // Calculate stats
  const totalQuestions = GRAMMAR_QUESTIONS.length + DIALOGUE_QUESTIONS.length + AUDIO_GAMES.length;
  const answeredGrammarCount = Object.keys(grammarAnswers).length;
  const answeredDialogueCount = Object.keys(dialogueAnswers).length;
  const answeredAudioCount = Object.keys(audioAnswers).length;
  const totalAnswered = answeredGrammarCount + answeredDialogueCount + answeredAudioCount;

  // Correct counter
  const correctGrammarCount = GRAMMAR_QUESTIONS.reduce((acc, q) => {
    return acc + (grammarAnswers[q.id] === q.correctAnswerIndex ? 1 : 0);
  }, 0);

  const correctDialogueCount = DIALOGUE_QUESTIONS.reduce((acc, q) => {
    return acc + (dialogueAnswers[q.id] === q.correctAnswerIndex ? 1 : 0);
  }, 0);

  const correctAudioCount = AUDIO_GAMES.reduce((acc, q) => {
    return acc + (audioAnswers[q.id] === q.correctAnswerIndex ? 1 : 0);
  }, 0);

  const totalCorrect = correctGrammarCount + correctDialogueCount + correctAudioCount;
  const accuracyPercent = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  // Checklist Sample Answers
  const ORAL_GUIDE = [
    {
      id: 1,
      q: "¿Dónde vive?",
      sample: "Yo vivo en un piso acogedor en la hermosa ciudad de Ereván.",
      translationArm: "Ես ապրում եմ հարմարավետ բնակարանում գեղեցիկ Երևան քաղաքում:",
      translationRus: "Я живу в уютной квартире в прекрасном городе Ереван."
    },
    {
      id: 2,
      q: "¿Con quién vive?",
      sample: "Vivo con mi familia y mi perro pequeño. Somos muy felices juntos.",
      translationArm: "Ես ապրում եմ իմ ընտանիքի և փոքրիկ շնիկիս հետ: Մենք շատ երջանիկ ենք միասին:",
      translationRus: "Я живу со своей семьей и маленькой собакой. Мы очень счастливы вместе."
    },
    {
      id: 3,
      q: "¿Vive en un piso de alquiler o el piso suyo?",
      sample: "Vivo en mi propio piso, es nuestro piso familiar, no es de alquiler.",
      translationArm: "Ես ապրում եմ իմ սեփական բնակարանում, դա մեր ընտանեկան բնակարանն է, վարձով չէ:",
      translationRus: "Я живу в собственной квартире, это наша семейная квартира, она не арендованная."
    },
    {
      id: 4,
      q: "¿Cómo es su casa?",
      sample: "Mi casa es espaciosa, luminosa y muy cómoda. Tiene tres habitaciones grandes.",
      translationArm: "Իմ տունը տարածուն է, լուսավոր և շատ հարմարավետ: Այն ունի երեք մեծ սենյակ:",
      translationRus: "Мой дом просторный, светлый и очень удобный. В нем три большие комнаты."
    },
    {
      id: 5,
      q: "¿Qué habitación le gusta más?",
      sample: "La habitación que más me gusta es el salón de estar porque tiene ventanas grandes y puedo leer libros con luz del sol.",
      translationArm: "Ամենաշատը սիրում եմ հյուրասենյակը, քանի որ այն ունի մեծ պատուհաններ, և ես կարող եմ գրքեր կարդալ արևի լույսի տակ:",
      translationRus: "Комната, которая мне нравится больше всего — это гостиная, потому что в ней большие окна и я могу читать книги при солнечном свете."
    }
  ];

  // AI interactive helper simulator for the oral drafts
  const handleAIFeedback = () => {
    if (!userSpeechDraft.trim()) {
      alert(lang === 'arm' ? "Խնդրում ենք նախ գրել ձեր նախագիծը սևագրի դաշտում:" : "Пожалуйста, сначала напишите ваш черновик текста!");
      return;
    }
    setIsAnalyzing(true);
    setAiFeedbackText("");
    
    // Simulate smart Spanish Tutor evaluation with highly precise customized grammar patterns
    setTimeout(() => {
      const draft = userSpeechDraft.toLowerCase();
      let feedback = "";
      
      if (lang === 'arm') {
        feedback += "🔍 **AI Թյութորի վերլուծություն.**\n\n";
        if (draft.includes("yo vivir") || draft.includes("mi vivir") || draft.includes("yo gustar")) {
          feedback += "⚠️ *Սխալ.* Դուք օգտագործել եք անորոշ դերբայ (vivir/gustar): Իսպաներենում բայերը պետք է խոնարհել: Օգտագործեք՝ «Yo vivo» (ես ապրում եմ) կամ «A mí me gusta» (ինձ դուր է գալիս):\n\n";
        }
        if (draft.includes("en mi casa hay") || draft.includes("en mi piso hay")) {
          feedback += "✅ *Գերազանց է.* Դուք ճիշտ եք կիրառել «hay» անդեմ բայական ձևը նոր առարկաներ նկարագրելիս:\n\n";
        }
        if (!draft.includes("piso") && !draft.includes("casa")) {
          feedback += "💡 *Խորհուրդ.* Փորձեք օգտագործել թեմատիկ բառեր, օրինակ՝ «piso» (բնակարան), «casa» (տուն), «habitación» (սենյակ):\n\n";
        }
        feedback += "✨ *Գնահատական.* Ձեր գրավոր խոսքը հրաշալի սկիզբ է: Շարունակեք մարզվել և փորձեք բարձրաձայն կարդալ ձեր նախադասությունները:";
      } else {
        feedback += "🔍 **Анализ AI-Тьютора:**\n\n";
        if (draft.includes("yo vivir") || draft.includes("mi vivir") || draft.includes("yo gustar")) {
          feedback += "⚠️ *Грамматика:* Вы использовали инфинитив глагола (vivir/gustar). Виспанском языке глаголы нужно спрягать лично. Пишите: «Yo vivo» (я живу) или «Me gusta» (мне нравится).\n\n";
        }
        if (draft.includes("en mi casa hay") || draft.includes("en mi piso hay")) {
          feedback += "✅ *Плюс:* Вы отлично использовали конструкцию «hay» для перечисления предметов в комнате.\n\n";
        }
        if (!draft.includes("piso") && !draft.includes("casa")) {
          feedback += "💡 *Рекомендация:* Рекомендуем вписать слова из прослушанной темы: «piso» (квартира), «casa» (дом), или «habitación» (комната).\n\n";
        }
        feedback += "✨ *Резюме:* Отличный тренировочный текст! Попробуйте сгенерировать произношение для написанных вами слов с помощью кнопки прослушивания.";
      }
      setAiFeedbackText(feedback);
      setIsAnalyzing(false);
    }, 1200);
  };

  return (
    <div 
      className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16 antialiased transition-all duration-200"
      style={{ fontSize: largeFont ? '1.1rem' : '0.96rem' }}
    >
      {/* Upper Navigation / Settings Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-100 animate-float">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-display font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                {t.title}
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-mono font-bold">A1/A2</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">{t.subtitle}</p>
            </div>
          </div>

          {/* Controls: Language, Score, Reset */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Bilingual Flag Switcher */}
            <div className="bg-slate-100 p-1 rounded-lg flex items-center gap-1">
              <button 
                onClick={() => setLang('arm')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${lang === 'arm' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                🇦🇲 Հայ
              </button>
              <button 
                onClick={() => setLang('rus')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${lang === 'rus' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                🇷🇺 Рус
              </button>
            </div>

            {/* Font Size Toggler control */}
            <div className="bg-slate-100 p-1 rounded-lg flex items-center gap-1">
              <button 
                onClick={() => setLargeFont(false)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${!largeFont ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                A
              </button>
              <button 
                onClick={() => setLargeFont(true)}
                className={`px-3 py-1 text-sm font-extrabold rounded-md transition-all ${largeFont ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                title={lang === 'arm' ? 'Ավելի մեծ տառատեսակ' : 'Увеличить шрифт'}
              >
                A+
              </button>
            </div>

            {/* Score Indicators */}
            <div className="bg-teal-50 border border-teal-100 text-teal-800 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>{t.score}: {totalCorrect} / {totalQuestions}</span>
            </div>

            {/* Reset Stats */}
            <button 
              id="reset_progress_state"
              onClick={handleResetProgress}
              className="text-xs bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 p-2 rounded-xl transition-all"
              title={t.resetBtn}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Hero Banner Area */}
      <div className="bg-gradient-to-r from-teal-700 to-emerald-600 text-white py-8 px-4 shadow-sm mb-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-display font-extrabold">{lang === 'arm' ? 'Ինտերակտիվ Իսպաներեն' : 'Интерактивный Испанский'}</h2>
            <p className="text-sm text-emerald-100 max-w-xl">
              {lang === 'arm' 
                ? 'Կատարեք քերականական վարժություններ և ստացեք ակնթարթային բացատրություն յուրաքանչյուր ընտրությունից հետո:' 
                : 'Выполняйте грамматические упражнения и получайте мгновенные разъяснения грамматики сразу после нажатия ответа!'}
            </p>
          </div>

          {/* Linear Progress Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl w-full md:w-80">
            <div className="flex justify-between items-center text-xs text-white/90 font-bold mb-2">
              <span>{lang === 'arm' ? 'Ավարտվածություն' : 'Общий прогресс'}</span>
              <span>{totalAnswered} / {totalQuestions} ({Math.round(totalAnswered/totalQuestions * 100)}%)</span>
            </div>
            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden font-sans">
              <div 
                className="bg-amber-400 h-full transition-all duration-500"
                style={{ width: `${(totalAnswered / totalQuestions) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-[11px] text-white/70 mt-3 font-mono">
              <span>{t.correctRate}: {accuracyPercent}%</span>
              <span>{lang === 'arm' ? 'Մակարդակ՝ Սկսնակ' : 'Уровень: Начинающий'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container Layout */}
      <main className="max-w-6xl mx-auto px-4">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap border-b border-slate-200 gap-1 mb-6">
          <button 
            onClick={() => setActiveTab('grammar')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'grammar' ? 'border-teal-600 text-teal-600' : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}`}
          >
            <BookMarked className="w-4 h-4" />
            {t.grammarQuiz}
            <span className="text-[10px] bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded-full font-mono font-bold">
              {answeredGrammarCount}/10
            </span>
          </button>
          
          <button 
            onClick={() => setActiveTab('reading')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'reading' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}`}
          >
            <BookOpen className="w-4 h-4" />
            {t.readingStory}
            <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded-full font-mono font-bold">
              {answeredDialogueCount}/10
            </span>
          </button>

          <button 
            onClick={() => setActiveTab('audio')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'audio' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}`}
          >
            <Volume2 className="w-4 h-4" />
            {t.audioGames}
            <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded-full font-mono font-bold">
              {answeredAudioCount}/5
            </span>
          </button>

          <button 
            onClick={() => setActiveTab('oral')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'oral' ? 'border-teal-600 text-teal-600' : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}`}
          >
            <Speech className="w-4 h-4" />
            {t.oralAssistant}
          </button>

          <button 
            onClick={() => setActiveTab('dictionary')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'dictionary' ? 'border-teal-600 text-teal-600' : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}`}
          >
            <Notebook className="w-4 h-4" />
            {t.dictionary}
            <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-full font-mono">
              {customWords.length}
            </span>
          </button>
        </div>

        {/* Dynamic Inner Game Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Quest Content Block */}
          <section className="lg:col-span-8 space-y-6">
            
            {/* 1. GRAMMAR QUIZ TAB */}
            {activeTab === 'grammar' && (
              <div className="space-y-6">
                {GRAMMAR_QUESTIONS.map((q, idx) => {
                  const userAnswerIndex = grammarAnswers[q.id];
                  const hasAnswered = userAnswerIndex !== undefined;
                  const showExplanation = visibleGrammarExplanations[q.id];

                  return (
                    <div 
                      key={q.id}
                      id={`grammar_question_wrap_${q.id}`} 
                      className={`bg-white rounded-3xl p-6 border transition-all ${hasAnswered ? 'border-slate-200 shadow-xs' : 'border-slate-300 shadow-md ring-1 ring-slate-100'}`}
                    >
                      {/* Question Label */}
                      <div className="flex justify-between items-start gap-3 mb-4">
                        <h3 className="text-base text-slate-950 font-display font-semibold tracking-tight">
                          {q.question}
                        </h3>
                        <button 
                          onClick={() => speakText(q.question.replace(/^\d+\.\s*/, "").replace(/\.\.\./, "___"))} 
                          className="p-1 text-slate-400 hover:text-teal-600 rounded-md transition-all"
                          title={t.speakBtn}
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Custom Round Radio Buttons based on screenshots */}
                      <div className="space-y-3">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = userAnswerIndex === optIdx;
                          const isCorrectOpt = q.correctAnswerIndex === optIdx;
                          
                          // Style determination matching original app UI:
                          let optionClass = "border-slate-200 hover:bg-slate-50 text-slate-700";
                          let circleClass = "border-slate-300 text-transparent";
                          
                          if (hasAnswered) {
                            if (isSelected) {
                              if (isCorrectOpt) {
                                optionClass = "border-emerald-500 bg-emerald-50/40 text-emerald-800 font-medium";
                                circleClass = "border-emerald-500 bg-emerald-500 text-white";
                              } else {
                                optionClass = "border-rose-300 bg-rose-50/40 text-rose-800 font-medium";
                                circleClass = "border-rose-400 bg-rose-400 text-white";
                              }
                            } else if (isCorrectOpt) {
                              optionClass = "border-emerald-200 bg-emerald-50/20 text-emerald-700";
                              circleClass = "border-emerald-300";
                            } else {
                              optionClass = "border-slate-100 text-slate-400 opacity-60";
                              circleClass = "border-slate-200";
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              disabled={hasAnswered}
                              onClick={() => handleGrammarOptionClick(q.id, optIdx)}
                              className={`w-full text-left p-3.5 px-5 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 text-sm focus:outline-hidden ${optionClass}`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-5.5 h-5.5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${circleClass}`}>
                                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white"></div>}
                                </div>
                                <span className="font-medium font-mono">{opt}</span>
                              </div>

                              {hasAnswered && isSelected && (
                                isCorrectOpt 
                                  ? <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                                  : <span className="text-rose-500 text-xs shrink-0 font-bold">X</span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation Box - SHOW ONLY AFTER CLICKING EXPLICITLY */}
                      {showExplanation && (
                        <div className="mt-5 pt-4 border-t border-slate-100 animate-pop">
                          <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-100/70 text-amber-900 text-xs text-slate-700">
                            <div className="flex items-center gap-2 font-display font-medium mb-1.5 text-amber-800">
                              <HelpCircle className="w-4 h-4 shrink-0 text-amber-600" />
                              <span>{t.whyTitle}</span>
                            </div>
                            <p className="leading-relaxed whitespace-pre-line">
                              {lang === 'arm' ? q.explanation.arm : q.explanation.rus}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* 2. DIALOGUE STORY TAB ("ԻՍԿ ՀԻՄԱ ԼՍԵՆՔ...") */}
            {activeTab === 'reading' && (
              <div className="space-y-6">
                
                {/* Dialogue card container */}
                <div className="bg-white rounded-3xl p-6 border border-purple-200 shadow-sm">
                  <h3 className="text-lg font-display font-extrabold text-slate-900 mb-2 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    {t.textTitle}
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">{t.dialogueInstructions}</p>

                  {/* Dialogue thread representation mimicking Oleg & María dialog */}
                  <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-100 space-y-4">
                    {DIALOGUE_LINES.map((line) => {
                      const isOleg = line.speaker === "Oleg";
                      const showTrans = dialogueLinesTranslation[line.id];

                      return (
                        <div 
                          key={line.id}
                          className={`flex items-start gap-3 transition-all ${isOleg ? 'flex-row' : 'flex-row-reverse'}`}
                        >
                          {/* Avatar representation with distinct visual theme */}
                          <div className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center font-bold text-xs shadow-xs text-white ${
                            isOleg ? 'bg-indigo-600' : 'bg-purple-600'
                          }`}>
                            {isOleg ? "👨🏻‍💼" : "👩🏻"}
                          </div>

                          {/* Chat bubble body clickable for Armenian translations */}
                          <div className="flex flex-col max-w-[80%]">
                            <div 
                              onClick={() => {
                                setDialogueLinesTranslation(prev => ({ ...prev, [line.id]: !prev[line.id] }));
                              }}
                              className={`p-3.5 rounded-2xl border text-sm transition-all cursor-pointer relative group ${
                                isOleg 
                                  ? 'bg-white border-slate-200 rounded-tl-none hover:border-indigo-300' 
                                  : 'bg-indigo-50/40 border-indigo-100 rounded-tr-none hover:border-purple-300'
                              }`}
                              title={lang === 'arm' ? 'Կտտացրեք՝ թարգմանելու' : 'Кликните для перевода'}
                            >
                              {/* Read aloud helper overlay */}
                              <div className="absolute top-1 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation(); // prevent translation toggle
                                    speakText(line.text.replace(/^(Oleg|María):\s*/i, ""));
                                  }}
                                  className="text-slate-400 hover:text-indigo-600 p-1 rounded-md"
                                  title={t.speakBtn}
                                >
                                  <Volume2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <p className="font-semibold text-slate-800 pr-5 leading-normal">
                                {line.text}
                              </p>

                              {/* Nested Armenian translation container */}
                              {showTrans && (
                                <div className="mt-2 pt-2 border-t border-slate-200/60 text-indigo-900 text-xs sm:text-sm leading-relaxed animate-pop font-medium">
                                  {line.translation}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Vocabulary matching items from dialogue */}
                  <div className="bg-purple-50/40 border border-purple-100 p-4 rounded-2xl mt-5">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-purple-800 mb-2.5 flex items-center gap-1.5">
                      <BookMarked className="w-4 h-4 text-purple-600" />
                      <span>{t.vocabulary} (Словарь)</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div className="bg-white p-3 rounded-xl border border-purple-100 text-center shadow-2xs">
                        <button onClick={() => speakText("apetece")} className="font-bold text-slate-800 text-xs hover:text-purple-600 flex items-center justify-center gap-1 mx-auto">
                          <span>apetece</span> <Volume2 className="w-3 h-3" />
                        </button>
                        <p className="text-[10px] text-slate-500 mt-1">хочется / տրամադրություն ունենալ</p>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-purple-100 text-center shadow-2xs">
                        <button onClick={() => speakText("quedar")} className="font-bold text-slate-800 text-xs hover:text-purple-600 flex items-center justify-center gap-1 mx-auto">
                          <span>quedar</span> <Volume2 className="w-3 h-3" />
                        </button>
                        <p className="text-[10px] text-slate-500 mt-1">встречаться / պայմանավորվել</p>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-purple-100 text-center shadow-2xs">
                        <button onClick={() => speakText("coger el metro")} className="font-bold text-slate-800 text-xs hover:text-purple-600 flex items-center justify-center gap-1 mx-auto">
                          <span>coger el metro</span> <Volume2 className="w-3 h-3" />
                        </button>
                        <p className="text-[10px] text-slate-500 mt-1">сесть на метро / մետրո նստել</p>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-purple-100 text-center shadow-2xs">
                        <button onClick={() => speakText("sin prisa")} className="font-bold text-slate-800 text-xs hover:text-purple-600 flex items-center justify-center gap-1 mx-auto">
                          <span>sin prisa</span> <Volume2 className="w-3 h-3" />
                        </button>
                        <p className="text-[10px] text-slate-500 mt-1">без спешки / առանց շտապելու</p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Dialogue Quiz Questions */}
                <div className="space-y-5">
                  {DIALOGUE_QUESTIONS.map((q) => {
                    const userAnswerIndex = dialogueAnswers[q.id];
                    const hasAnswered = userAnswerIndex !== undefined;
                    const showExplanation = visibleDialogueExplanations[q.id];

                    return (
                      <div 
                        key={q.id}
                        className={`bg-white rounded-3xl p-6 border transition-all ${hasAnswered ? 'border-slate-200 animate-fade-in' : 'border-purple-200 hover:border-purple-300 shadow-sm'}`}
                      >
                        <div className="flex justify-between items-start gap-4 mb-3">
                          <h4 className="text-sm font-bold text-slate-900">{q.question}</h4>
                          <button 
                            onClick={() => speakText(q.question.replace(/^\d+\.\s*/, ""))} 
                            className="text-slate-400 hover:text-purple-600 rounded-md transition-all p-1"
                            title={t.speakBtn}
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Options structured with Purple/Indigo colors for beautiful theme divergence */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = userAnswerIndex === optIdx;
                            const isCorrectOpt = q.correctAnswerIndex === optIdx;
                            
                            let optionClass = "border-slate-200 hover:bg-slate-50 text-slate-700";
                            let circleClass = "border-slate-300";

                            if (hasAnswered) {
                              if (isSelected) {
                                if (isCorrectOpt) {
                                  optionClass = "border-emerald-500 bg-emerald-50/40 text-emerald-800 font-medium";
                                  circleClass = "border-emerald-500 bg-emerald-500";
                                } else {
                                  optionClass = "border-rose-300 bg-rose-50/40 text-rose-800 font-medium";
                                  circleClass = "border-rose-400 bg-rose-400";
                                }
                              } else if (isCorrectOpt) {
                                optionClass = "border-emerald-200 bg-emerald-50/20 text-emerald-700";
                                circleClass = "border-emerald-300";
                              } else {
                                optionClass = "border-slate-100 text-slate-400 opacity-60";
                                circleClass = "border-slate-200";
                              }
                            }

                            return (
                              <button
                                key={optIdx}
                                disabled={hasAnswered}
                                onClick={() => handleDialogueOptionClick(q.id, optIdx)}
                                className={`text-left p-3 px-4 rounded-xl border-2 transition-all flex items-center justify-between gap-3 text-xs ${optionClass}`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${circleClass}`}>
                                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white"></div>}
                                  </div>
                                  <span>{opt}</span>
                                </div>
                                {hasAnswered && isSelected && (
                                  isCorrectOpt 
                                    ? <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                    : <span className="text-rose-500 text-xs shrink-0 font-bold">X</span>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanation panel revealed ONLY AFTER selection */}
                        {showExplanation && (
                          <div className="mt-4 pt-4 border-t border-slate-100 animate-pop">
                            <p className="text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed">
                              <span className="font-bold text-purple-700 uppercase tracking-wider block mb-1 text-[10px]">{t.explanation}</span>
                              {lang === 'arm' ? q.explanation.arm : q.explanation.rus}
                            </p>
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>

              </div>
            )}

            {/* 3. AUDIO-BASED QUIZ GAMES TAB */}
            {activeTab === 'audio' && (
              <div className="space-y-6">
                
                {/* Intro guidance banner */}
                <div className="bg-gradient-to-tr from-indigo-900 to-slate-900 rounded-3xl p-6 text-white border border-indigo-950 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-4 opacity-10 pointer-events-none text-9xl">
                    🎧
                  </div>
                  <div className="relative z-10 space-y-2">
                    <span className="text-xs bg-indigo-500/30 text-indigo-200 border border-indigo-500/40 px-3 py-1 rounded-full font-mono uppercase tracking-widest font-bold">
                      {lang === 'arm' ? 'Լսողական խաղեր' : 'Аудиоигры'}
                    </span>
                    <h3 className="text-xl font-display font-extrabold text-white">
                      {lang === 'arm' ? 'Լսեք իսպաներենը և մարզեք ականջը' : 'Слушайте испанский и тренируйте слух'}
                    </h3>
                    <p className="text-xs text-indigo-200 max-w-xl leading-relaxed">
                      {lang === 'arm' 
                        ? 'Յուրաքանչյուր խաղում լսեք արտասանությունը, պատասխանեք հարցին և բացահայտեք գրված տեքստը ինքնաստուգման համար:' 
                        : 'В каждой игре прослушайте произношение, ответьте на вопрос на вашем языке и откройте скрытый испанский текст для самопроверки!'}
                    </p>
                  </div>
                </div>

                {/* 5 Audio Quiz cards */}
                <div className="space-y-6">
                  {AUDIO_GAMES.map((game, idx) => {
                    const userAnswerIndex = audioAnswers[game.id];
                    const hasAnswered = userAnswerIndex !== undefined;
                    const showExplanation = visibleAudioExplanations[game.id];
                    const isTextRevealed = revealedAudioTexts[game.id];

                    return (
                      <div 
                        key={game.id}
                        className={`bg-white rounded-3xl p-6 border transition-all relative ${
                          hasAnswered ? 'border-slate-200 shadow-xs' : 'border-indigo-200 hover:border-indigo-300 shadow-sm'
                        }`}
                      >
                        {/* Game tag indicator */}
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] bg-slate-100 px-2.5 py-1 rounded-md text-slate-500 font-mono font-bold tracking-widest uppercase">
                            {lang === 'arm' ? `Խաղ ${idx + 1}` : `Игра ${idx + 1}`}
                          </span>
                          
                          {hasAnswered && (
                            <span className={`text-[11px] font-bold font-mono px-2.5 py-0.5 rounded-full ${
                              userAnswerIndex === game.correctAnswerIndex 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              {userAnswerIndex === game.correctAnswerIndex 
                                ? (lang === 'arm' ? 'Ճիշտ է' : 'Правильно')
                                : (lang === 'arm' ? 'Սխալ է' : 'Неверно')}
                            </span>
                          )}
                        </div>

                        {/* Interactive Play & Reveal Deck styled in a distinct indigo pattern */}
                        <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/60 flex flex-col sm:flex-row items-center justify-between gap-4 mb-5">
                          
                          <div className="flex items-center gap-3">
                            {/* Large Play Audio Button */}
                            <button
                              onClick={() => speakText(game.audioText)}
                              className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center transition-all shadow-md active:scale-95 group shrink-0"
                              title={lang === 'arm' ? "Լսել աուդիոն" : "Прослушать аудио"}
                            >
                              <Volume2 className="w-5 h-5 animate-pulse" />
                            </button>
                            
                            <div>
                              <p className="text-xs font-bold text-indigo-950 font-display">
                                {lang === 'arm' ? "Իսպաներեն աուդիո" : "Испанское аудио"}
                              </p>
                              <p className="text-[11px] text-slate-500">
                                {lang === 'arm' ? "Սեղմեք՝ բարձրաձայն լսելու համար" : "Нажмите для воспроизведения"}
                              </p>
                            </div>
                          </div>

                          {/* Reveal/Hide text controller */}
                          <button
                            onClick={() => {
                              setRevealedAudioTexts(prev => ({ ...prev, [game.id]: !prev[game.id] }));
                            }}
                            className="text-xs border border-indigo-200 hover:border-indigo-400 bg-white text-indigo-700 px-4 py-2.5 rounded-xl transition-all font-semibold flex items-center gap-1.5 shadow-2xs"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                            <span>
                              {isTextRevealed 
                                ? (lang === 'arm' ? "Թաքցնել տեքստը" : "Скрыть текст")
                                : (lang === 'arm' ? "Ցուցադրել տեքստը" : "Показать текст")}
                            </span>
                          </button>

                        </div>

                        {/* Speech Bubble when Spanish original text is revealed */}
                        {isTextRevealed && (
                          <div className="mb-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 animate-pop font-mono text-center">
                            <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider block mb-1">
                              {lang === 'arm' ? "Բնօրինակ իսպաներեն տեքստ" : "Оригинальный испанский текст"}
                            </span>
                            <p className="text-slate-800 text-sm font-semibold italic">
                              "{game.audioText}"
                            </p>
                          </div>
                        )}

                        {/* Quiz Question */}
                        <div className="mb-4">
                          <h4 className="text-base font-display font-extrabold text-slate-900 leading-snug">
                            {lang === 'arm' ? game.question.arm : game.question.rus}
                          </h4>
                        </div>

                        {/* Options Section */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {game.options[lang === 'arm' ? 'arm' : 'rus'].map((opt, optIdx) => {
                            const isSelected = userAnswerIndex === optIdx;
                            const isCorrectOpt = game.correctAnswerIndex === optIdx;
                            
                            let optionClass = "border-slate-200 hover:border-indigo-200 hover:bg-slate-50/50 text-slate-700";
                            let circleClass = "border-slate-300";

                            if (hasAnswered) {
                              if (isSelected) {
                                if (isCorrectOpt) {
                                  optionClass = "border-emerald-500 bg-emerald-50/40 text-emerald-800 font-medium";
                                  circleClass = "border-emerald-500 bg-emerald-500";
                                } else {
                                  optionClass = "border-rose-300 bg-rose-50/40 text-rose-800 font-medium";
                                  circleClass = "border-rose-400 bg-rose-400";
                                }
                              } else if (isCorrectOpt) {
                                optionClass = "border-emerald-200 bg-emerald-50/20 text-emerald-700";
                                circleClass = "border-emerald-300";
                              } else {
                                optionClass = "border-slate-100 text-slate-400 opacity-60";
                                circleClass = "border-slate-200";
                              }
                            }

                            return (
                              <button
                                key={optIdx}
                                disabled={hasAnswered}
                                onClick={() => handleAudioOptionClick(game.id, optIdx)}
                                className={`text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 text-xs sm:text-sm font-medium ${optionClass}`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${circleClass}`}>
                                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white"></div>}
                                  </div>
                                  <span>{opt}</span>
                                </div>
                                {hasAnswered && isSelected && (
                                  isCorrectOpt 
                                    ? <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                    : <span className="text-rose-500 text-xs shrink-0 font-bold">X</span>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanation panel revealed ONLY AFTER selection */}
                        {showExplanation && (
                          <div className="mt-4 pt-4 border-t border-slate-100 animate-pop">
                            <p className="text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200/60 leading-relaxed font-sans">
                              <span className="font-bold text-indigo-700 uppercase tracking-wider block mb-1 text-[10px]">
                                {lang === 'arm' ? 'Բացատրություն' : 'Разбор фразы'}
                              </span>
                              {lang === 'arm' ? game.explanation.arm : game.explanation.rus}
                            </p>
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>

              </div>
            )}

            {/* 3. ORAL SPEAKING ASSISTANT COMPONENT */}
            {activeTab === 'oral' && (
              <div className="space-y-6">
                
                {/* Oral Instruction Banner */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
                  <div className="flex items-center gap-3 mb-4">
                    <p className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 text-xl font-bold">
                      ℹ️
                    </p>
                    <div>
                      <h3 className="font-display font-bold text-slate-900 text-base">{t.presentationChecklist}</h3>
                      <p className="text-xs text-slate-500">{t.presentationDesc}</p>
                    </div>
                  </div>

                  {/* Question Checklist cards */}
                  <div className="space-y-3">
                    {ORAL_GUIDE.map((item, idx) => {
                      const isSelected = selectedOralCard === item.id;
                      
                      return (
                        <div 
                          key={item.id}
                          className={`rounded-2xl border transition-all ${isSelected ? 'border-teal-500 bg-teal-50/20' : 'border-slate-200 bg-white'}`}
                        >
                          <button 
                            onClick={() => setSelectedOralCard(isSelected ? null : item.id)}
                            className="w-full text-left p-4 flex items-center justify-between gap-4 font-semibold text-slate-800 text-xs sm:text-sm"
                          >
                            <span className="flex items-center gap-3 text-slate-900">
                              <span className="text-teal-600 bg-teal-50 w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono">
                                {idx + 1}
                              </span>
                              {item.q}
                            </span>
                            <span className="text-xs text-teal-600 hover:underline flex items-center gap-0.5 font-normal">
                              {t.viewSample} <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          </button>

                          {isSelected && (
                            <div className="p-4 pt-0 border-t border-slate-100 space-y-3 animate-pop">
                              {/* Spanish sample speech helper */}
                              <div className="bg-white/80 border border-slate-200 p-3 rounded-xl flex items-start justify-between gap-3">
                                <div>
                                  <p className="font-mono text-xs sm:text-sm text-slate-900 font-bold select-all leading-relaxed">
                                    "{item.sample}"
                                  </p>
                                  <p className="text-xs text-slate-500 italic mt-2 leading-relaxed">
                                    {lang === 'arm' ? item.translationArm : item.translationRus}
                                  </p>
                                </div>
                                <button
                                  onClick={() => speakText(item.sample)}
                                  className="bg-teal-50 border border-teal-100 text-teal-700 p-2.5 rounded-full hover:bg-teal-100 transition-all shrink-0"
                                  title={t.speakBtn}
                                >
                                  <Volume2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                </div>

                {/* Practical Notepad Workspace */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <h4 className="font-display font-medium text-slate-900 text-sm flex items-center gap-2">
                    <Notebook className="w-4 h-4 text-teal-600" />
                    <span>{t.userNotes}</span>
                  </h4>
                  <textarea 
                    value={userSpeechDraft}
                    onChange={(e) => setUserSpeechDraft(e.target.value)}
                    placeholder={t.placeholderNotes}
                    className="w-full h-32 border border-slate-200 rounded-2xl p-4 text-xs font-mono focus:border-teal-500 focus:outline-hidden leading-relaxed"
                  />
                  
                  {/* AI Tutor Assistant analysis tool */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <button 
                      onClick={() => speakText(userSpeechDraft)}
                      disabled={!userSpeechDraft}
                      className="text-xs border border-slate-200 bg-slate-50 text-slate-700 px-4 py-2 rounded-xl flex items-center gap-1.5 hover:bg-white transition-all disabled:opacity-50"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>{t.speakBtn}</span>
                    </button>

                    <button 
                      onClick={handleAIFeedback}
                      disabled={isAnalyzing}
                      className="text-sm bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{isAnalyzing ? "..." : t.generateAIFeedback}</span>
                    </button>
                  </div>

                  {aiFeedbackText && (
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mt-3 animate-pop">
                      <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {aiFeedbackText}
                      </p>
                    </div>
                  )}

                </div>

              </div>
            )}

            {/* 4. PRIVATE DICTIONARY HELPER */}
            {activeTab === 'dictionary' && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
                
                {/* EDUCATIONAL DETAILED INSIGHTS (BILINGUAL WIDGET) */}
                <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-3xl p-5 sm:p-6 border-2 border-teal-100/60 space-y-6">
                  <div className="flex items-center gap-2 pb-3 border-b border-teal-100">
                    <Sparkles className="w-5 h-5 text-teal-600 animate-pulse" />
                    <h3 className="font-display font-extrabold text-base sm:text-lg text-slate-900">
                      {lang === 'arm' ? "Բառապաշարի և Գրամատիկայի կարևոր նրբություններ" : "Важные нюансы словаря и грамматики"}
                    </h3>
                  </div>

                  {/* 1. Comoda vs Acogedora */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-xs space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">✅</span>
                      <h4 className="font-display font-extrabold text-sm sm:text-base text-slate-900">
                        {lang === 'arm' 
                          ? "Այո, cómoda և acogedora երկուսն էլ ածականներ են՝ adjetivos" 
                          : "Да, cómoda и acogedora оба являются прилагательными (adjetivos)"}
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* comoda info */}
                      <div className="bg-slate-50/70 p-4 rounded-xl space-y-2 border border-slate-100">
                        <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-mono">
                          cómoda
                        </span>
                        <p className="text-sm font-semibold text-slate-800">
                          {lang === 'arm' ? "հարմարավետ / հարմար" : "удобный (физически)"}
                        </p>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {lang === 'arm' 
                            ? "Օգտագործում ենք, երբ ինչ-որ բան հարմար է մարմնի համար կամ հարմար է օգտագործելու համար։" 
                            : "Используется, когда что-то комфортно физически для тела или удобно в использовании."}
                        </p>
                        <div className="pt-2 border-t border-slate-200/40 text-xs font-mono text-teal-800 space-y-1">
                          <p onClick={() => speakText("La silla es cómoda")} className="cursor-pointer hover:underline"><strong>La silla es cómoda.</strong> (Աթոռը հարմարավետ է:)</p>
                          <p onClick={() => speakText("La cama es cómoda")} className="cursor-pointer hover:underline"><strong>La cama es cómoda.</strong> (Մահճակալը հարմարավետ է:)</p>
                          <p onClick={() => speakText("La casa es cómoda")} className="cursor-pointer hover:underline"><strong>La casa es cómoda.</strong> (Տունը հարմար է ապրելու համար:)</p>
                        </div>
                      </div>

                      {/* acogedora info */}
                      <div className="bg-slate-50/70 p-4 rounded-xl space-y-2 border border-slate-100">
                        <span className="text-xs font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-md font-mono">
                          acogedora
                        </span>
                        <p className="text-sm font-semibold text-slate-800">
                          {lang === 'arm' ? "հարմարավետ, ջերմ, հաճելի մթնոլորտով / уютный" : "уютный, гостеприимный (атмосфера)"}
                        </p>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {lang === 'arm' 
                            ? "Օգտագործում ենք, երբ տեղը ստեղծում է ջերմություն, հանգստություն, հաճելի մթնոլորտ։" 
                            : "Используется, когда место создает ощущение тепла, покоя и приятной домашней атмосферы."}
                        </p>
                        <div className="pt-2 border-t border-slate-200/40 text-xs font-mono text-teal-800 space-y-1">
                          <p onClick={() => speakText("La habitación es acogedora")} className="cursor-pointer hover:underline"><strong>La habitación es acogedora.</strong> (Սենյակը ջերմ ու հարմարավետ է:)</p>
                          <p onClick={() => speakText("La casa es acogedora")} className="cursor-pointer hover:underline"><strong>La casa es acogedora.</strong> (Տունը уютный է / ջերմ մթնոլորտ ունի:)</p>
                          <p onClick={() => speakText("El restaurante es acogedor")} className="cursor-pointer hover:underline"><strong>El restaurante es acogedor.</strong> (Ռեստորանը уютный է / հաճելի մթնոլորտ ունի:)</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-100 text-xs text-amber-900 leading-relaxed">
                      <strong>{lang === 'arm' ? "Կարճ տարբերությունը՝" : "Краткое отличие:"}</strong><br />
                      <strong>cómoda</strong> — {lang === 'arm' ? "ֆիզիկապես հարմար է" : "физически удобно"}<br />
                      <strong>acogedora</strong> — {lang === 'arm' ? "մթնոլորտով ջերմ ու հաճելի է" : "атмосферно тепло и приятно"}<br />
                      <span className="mt-2 block font-mono text-teal-950 font-semibold" onClick={() => speakText("Mi casa es cómoda y acogedora")}>
                        👉 <strong>Mi casa es cómoda y acogedora.</strong> (Ինչը նշանակում է՝ իմ տունը հարմար է ապրելու համար և ունի ջերմ, հաճելի մթնոլորտ:)
                      </span>
                    </div>
                  </div>

                  {/* 2. Piso de alquiler vs Su piso */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-xs space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🏠</span>
                      <h4 className="font-display font-extrabold text-sm sm:text-base text-slate-900">
                        {lang === 'arm' ? "piso de alquiler vs su piso (Բնակարանների սեփականություն)" : "piso de alquiler vs su piso (Собственность жилья)"}
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* piso de alquiler */}
                      <div className="bg-slate-50/70 p-4 rounded-xl space-y-2 border border-slate-100">
                        <span className="text-xs font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md font-mono">
                          piso de alquiler
                        </span>
                        <p className="text-sm font-semibold text-slate-800">
                          {lang === 'arm' ? "վարձով բնակարան / վարձակալվող բնակարան" : "арендованная квартира"}
                        </p>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {lang === 'arm' 
                            ? "Այսինքն՝ բնակարանը իրենը չէ, նա այն վարձում է։" 
                            : "То есть квартира не принадлежит живущему, он её снимает/арендует."}
                        </p>
                        <div className="pt-2 border-t border-slate-200/40 text-xs font-mono text-teal-800">
                          <p onClick={() => speakText("Vivo en un piso de alquiler")} className="cursor-pointer hover:underline"><strong>Vivo en un piso de alquiler.</strong> (Ես ապրում եմ վարձով բնակարանում:)</p>
                        </div>
                      </div>

                      {/* su piso / el piso suyo */}
                      <div className="bg-slate-50/70 p-4 rounded-xl space-y-2 border border-slate-100">
                        <span className="text-xs font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-md font-mono">
                          su piso / el piso suyo
                        </span>
                        <p className="text-sm font-semibold text-slate-800">
                          {lang === 'arm' ? "իր բնակարանը / սեփական բնակարանը" : "его/её квартира"}
                        </p>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {lang === 'arm' 
                            ? "Այսինքն՝ բնակարանը պատկանում է նրան կամ խոսում ենք կոնկրետ իր բնակարանի մասին։" 
                            : "То есть квартира принадлежит ему/ей или мы говорим именно про их квартиру."}
                        </p>
                        <div className="pt-2 border-t border-slate-200/40 text-xs font-mono text-teal-800 space-y-1">
                          <p onClick={() => speakText("Vive en su piso")} className="cursor-pointer hover:underline"><strong>Vive en su piso.</strong> (Նա ապրում է իր բնակարանում:)</p>
                          <p onClick={() => speakText("El piso es suyo")} className="cursor-pointer hover:underline"><strong>El piso es suyo.</strong> (Բնակարանը իրենն է:)</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-teal-50 p-3.5 rounded-xl border border-teal-100 text-xs text-teal-900 leading-relaxed space-y-1">
                      <p><strong>{lang === 'arm' ? "Կարճ՝" : "Кратко:"}</strong></p>
                      <p>🔹 <strong>piso de alquiler</strong> — {lang === 'arm' ? "վարձով բնակարան է" : "это арендованная квартира"}</p>
                      <p>🔹 <strong>su piso / el piso suyo</strong> — {lang === 'arm' ? "իր բնակարանն է" : "это его/своя квартира"}</p>
                      <p className="mt-2 text-slate-700">
                        💡 {lang === 'arm' 
                          ? "Ավելի բնական իսպաներենում ասում են su piso, ոչ թե շատ հաճախ el piso suyo:" 
                          : "В естественном испанском языке всегда предпочитают говорить su piso вместо el piso suyo."}
                      </p>
                      <span className="mt-2 block font-mono text-teal-950 font-semibold" onClick={() => speakText("¿Es un piso de alquiler o es su piso?")}>
                        👉 <strong>¿Es un piso de alquiler o es su piso?</strong> (Դա վարձով բնակարա՞ն է, թե՞ իր բնակարանն է:)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Form to insert new vocabulary card */}
                <form onSubmit={handleAddWord} className="bg-slate-50/70 rounded-2xl p-4 sm:p-5 border border-slate-100 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-700 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-teal-600" />
                    <span>{t.addWord}</span>
                  </h4>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input 
                      type="text"
                      required
                      value={newWord}
                      onChange={(e) => setNewWord(e.target.value)}
                      placeholder={t.wordPlholder}
                      className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-mono focus:outline-hidden focus:border-teal-500 grow"
                    />
                    <input 
                      type="text"
                      required
                      value={newTranslation}
                      onChange={(e) => setNewTranslation(e.target.value)}
                      placeholder={t.translationPlholder}
                      className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-hidden focus:border-teal-500 grow"
                    />
                    <button 
                      type="submit"
                      className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2 rounded-xl transition-all text-xs shrink-0"
                    >
                      {t.addBtn}
                    </button>
                  </div>
                </form>

                {/* Vocabulary Cards Deck */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {customWords.map((card, idx) => (
                    <div 
                      key={idx}
                      className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex items-center justify-between gap-4"
                    >
                      <div>
                        <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md font-mono">
                          es
                        </span>
                        <h4 className="font-display font-semibold text-sm text-slate-900 mt-1 cursor-pointer hover:text-teal-600" onClick={() => speakText(card.word)}>
                          {card.word}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {card.translation}
                        </p>
                      </div>

                      <button 
                        onClick={() => speakText(card.word)}
                        className="text-slate-400 hover:text-teal-600 border border-slate-100 hover:bg-slate-50 p-2 rounded-full transition-all shrink-0"
                        title={t.speakBtn}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

              </div>
            )}

          </section>

          {/* RIGHT SIDEBAR - STUDY BOARD / UTILITIES */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Mascot Tip box based on original Duolingo style guides */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-100">
                <span className="text-2xl">🦉</span>
                <div>
                  <h4 className="font-display font-bold text-xs text-slate-900">Eduardo (🦉 AI Tutor)</h4>
                  <p className="text-[10px] text-slate-400">Guía de aprendizaje</p>
                </div>
              </div>
              
              <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
                <p>
                  {lang === 'arm' 
                    ? 'Բարև՛: Իսպաներենում «Estar»-ը օգտագործվում է գտնվելու վայրի համար, իսկ «Ser»-ը՝ էության, մասնագիտության և ծագման համար:' 
                    : 'Привет! Запомни простое правило: глагол «Estar» мы используем для указания места, а «Ser» — для описания сути объекта, профессии и происхождения.'}
                </p>
                <p className="bg-teal-50 text-teal-800 p-2.5 rounded-xl border border-teal-100 text-[11px] font-mono">
                  💡 *Mi madre tiene ... años* → siempre usamos "tener" para la edad.
                </p>
              </div>
            </div>

            {/* Quick Goals checklist */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
              <h4 className="font-display font-bold text-xs text-slate-900 text-uppercase tracking-wider">
                {t.studyGoals}
              </h4>
              
              <div className="space-y-2 text-xs">
                <label className="flex items-start gap-2.5 p-1 cursor-pointer">
                  <input type="checkbox" checked={answeredGrammarCount >= 5} readOnly className="mt-0.5 accent-teal-600" />
                  <span className={answeredGrammarCount >= 5 ? "line-through text-slate-400" : ""}>
                    {lang === 'arm' ? 'Լրացնել առնվազն 5 քերականական հարց' : 'Пройти минимум 5 вопросов грамматики'}
                  </span>
                </label>
                
                <label className="flex items-start gap-2.5 p-1 cursor-pointer">
                  <input type="checkbox" checked={answeredGrammarCount === 10} readOnly className="mt-0.5 accent-teal-600" />
                  <span className={answeredGrammarCount === 10 ? "line-through text-slate-400" : ""}>
                    {lang === 'arm' ? 'Լրացնել ամբողջական թեստը (10/10)' : 'Завершить весь тест полностью (10/10)'}
                  </span>
                </label>

                <label className="flex items-start gap-2.5 p-1 cursor-pointer">
                  <input type="checkbox" checked={answeredDialogueCount >= 5} readOnly className="mt-0.5 accent-teal-600" />
                  <span className={answeredDialogueCount >= 5 ? "line-through text-slate-400" : ""}>
                    {lang === 'arm' ? 'Լրացնել առնվազն 5 երկխոսության հարց' : 'Пройти минимум 5 вопросов диалога'}
                  </span>
                </label>

                <label className="flex items-start gap-2.5 p-1 cursor-pointer">
                  <input type="checkbox" checked={answeredAudioCount >= 3} readOnly className="mt-0.5 accent-teal-600" />
                  <span className={answeredAudioCount >= 3 ? "line-through text-slate-400" : ""}>
                    {lang === 'arm' ? 'Լրացնել առնվազն 3 լսողական խաղ' : 'Пройти минимум 3 аудиоигры'}
                  </span>
                </label>

                <label className="flex items-start gap-2.5 p-1 cursor-pointer">
                  <input type="checkbox" checked={userSpeechDraft.length > 10} readOnly className="mt-0.5 accent-teal-600" />
                  <span className={userSpeechDraft.length > 10 ? "line-through text-slate-400" : ""}>
                    {lang === 'arm' ? 'Գրել սեփական պատասխանը սևագրում' : 'Написать свой черновик речи'}
                  </span>
                </label>
              </div>
            </div>

            {/* Interactive Stats Panel */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs text-center space-y-2">
              <Award className="w-8 h-8 text-amber-500 mx-auto" />
              <div className="font-display font-extrabold text-lg text-slate-900">
                {totalCorrect === totalQuestions ? "🥇 Perfect Score!" : `${totalCorrect} / ${totalQuestions}`}
              </div>
              <p className="text-[11px] text-slate-500">
                {lang === 'arm' ? 'Ճշտություն և ջանասիրություն ուսման մեջ' : 'Точность и глубина прохождения курса'}
              </p>
            </div>

          </aside>

        </div>

      </main>

      {/* Decorative clean footer */}
      <footer className="max-w-6xl mx-auto px-4 mt-16 pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
        <p>© 2026 {t.title}. {lang === 'arm' ? 'Բոլոր իրավունքները պաշտպանված են:' : 'Все права сохранены за учебной программой.'}</p>
        <p className="text-[11px] text-slate-500 mt-1 font-mono">Español A1 - Armenia y Rusia Escuela Integradora</p>
      </footer>
    </div>
  );
}
