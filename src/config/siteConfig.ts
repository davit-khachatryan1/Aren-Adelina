import { WeddingConfig } from "../types/site";

export const siteConfig: WeddingConfig & {
  weddingDateLabel: string;
  intro: {
    title: string;
    tapHint: string;
    footer: string;
  };
  story: {
    title: string;
    description: string;
  };
  scheduleTitle: string;
  rsvp: {
    title: string;
    subtitle: string;
    labels: {
      attendingQuestion: string;
      attendingYes: string;
      attendingNo: string;
      partsQuestion: string;
      ceremony: string;
      party: string;
      fullName: string;
      guestCount: string;
      note: string;
      submit: string;
      success: string;
      errorFallback: string;
    };
  };
  info: {
    title: string;
    paragraphs: string[];
  };
} = {
  locale: "hy",
  coupleNames: "Արեն և Ադելինա",
  weddingDateISO: "2026-04-19T16:00:00+04:00",
  weddingDateLabel: "Ապրիլ 19, 2026",
  heroImage: "/assets/images/hero-couple.jpg",
  storyImages: [
    {
      src: "/assets/images/story-desktop-1.jpg",
      alt: "Զույգի լուսանկար 1",
      desktopObjectPosition: "47% 36%",
      mobileObjectPosition: "50% 30%",
      layer: "primary"
    },
    {
      src: "/assets/images/story-desktop-2.jpg",
      alt: "Զույգի լուսանկար 2",
      desktopObjectPosition: "54% 28%",
      mobileObjectPosition: "53% 30%",
      layer: "secondary"
    }
  ],
  musicFile: "/assets/audio/wedding-theme.mp3",
  rsvpEndpoint: import.meta.env.VITE_RSVP_ENDPOINT ?? "/rsvp",
  ctaLabel: "Պատասխանել",
  intro: {
    title: "Դուք հրավիրված եք մեր հարսանիքին",
    tapHint: "Բացեք ծրարը",
    footer:
      "Այս կայքում դուք կտեսնեք արարողության մանրամասները և RSVP ձևը։ Խնդրում ենք հաստատել մասնակցությունը ժամանակին։"
  },
  story: {
    title: "Սիրելի հարազատներ և ընկերներ",
    description:
      "Սիրով հրավիրում ենք ձեզ մեր հարսանյաց արարողությանը։ Ձեր ներկայությունը մեր օրվա էլ ավելի անսահման ուրախություն կպարգևի։"
  },
  scheduleTitle: "Օրվա ծրագիրը",
  events: [
    {
      id: "ceremony",
      title: "Պսակադրություն",
      time: "16:00",
      venue: "Սուրբ Գևորգ եկեղեցի",
      address: "Արարատի մարզ, գ. Մարմարաշեն, 36-րդ փողոց",
      mapUrl: "https://maps.google.com/?q=40.059,44.521",
      icon: "/assets/icons/rings.svg"
    },
    {
      id: "party",
      title: "Խնջույք",
      time: "17:30",
      venue: "«Մորենա» ռեստորանային համալիր",
      address: "ք. Մասիս, Մխչյան խճուղի 7/8",
      mapUrl: "https://maps.google.com/?q=40.061,44.424",
      icon: "/assets/icons/champagne.svg"
    }
  ],
  rsvp: {
    title: "Մասնակցության հաստատում",
    subtitle: "Խնդրում ենք լրացնել մինչև 09.04.26",
    labels: {
      attendingQuestion: "Կկարողանա՞ք ներկա գտնվել միջոցառմանը",
      attendingYes: "Այո, կգամ",
      attendingNo: "Ցավոք, չեմ կարող",
      partsQuestion: "Ո՞ր փուլին եք հրավիրված",
      ceremony: "Լիդիայի",
      party: "Դավիթի",
      fullName: "Անուն, Ազգանուն",
      guestCount: "Հյուրերի քանակը",
      note: "Մեկնաբանություն (ըստ ցանկության)",
      submit: "Ուղարկել",
      success: "Շնորհակալություն, ձեր պատասխանն ընդունվեց։",
      errorFallback: "Չհաջողվեց ուղարկել։ Փորձեք կրկին։"
    }
  },
  info: {
    title: "Նախապես մեկ ժեչ",
    paragraphs: [
      "Հարգելի հյուրեր, սիրով խնդրում ենք ժամանակին ժամանել, որպեսզի արարողությունը սկսվի նախատեսված ժամին։",
      "Խնդրում ենք պահպանել տոնական տրամադրությունը և ժպիտը։",
      "Ձեր ներկայությունը մեր համար մեծ օրհնություն է, և անհամբերությամբ սպասում ենք այդ օրվան։"
    ]
  }
};

export const assertWeddingConfig = (input: WeddingConfig): WeddingConfig => {
  if (!input.coupleNames.trim()) {
    throw new Error("coupleNames is required");
  }
  if (!input.weddingDateISO.trim()) {
    throw new Error("weddingDateISO is required");
  }
  if (!input.heroImage.trim()) {
    throw new Error("heroImage is required");
  }
  if (input.storyImages.length < 2) {
    throw new Error("At least two story images are required");
  }
  if (input.storyImages.some(image => !image.src.trim())) {
    throw new Error("Each story image must include src");
  }
  if (input.events.length < 1) {
    throw new Error("At least one event is required");
  }
  return input;
};
