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
  weddingDateISO: "2026-04-18T16:00:00+04:00",
  weddingDateLabel: "Ապրիլ 18, 2026",
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
  musicFile: "/assets/audio/talking-to-the-moon.mp3",
  rsvpEndpoint: import.meta.env.VITE_RSVP_ENDPOINT ?? "/rsvp",
  ctaLabel: "Պատասխանել",
  intro: {
    title: "Դուք հրավիրված եք մեր հարսանիքին",
    tapHint: "Բացեք ծրարը",
    footer:
      "Այս հրավերը Դուք պատահական չեք ստացել։\nՄեզ համար հատկապես կարևոր է, որ այս յուրահատուկ օրը մեր կողքին լինեն ամենամտերիմ մարդիկ։"
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
      venue: "Կեչառիսի վանական համալիր",
      address: "Խաչատուր Կեչառեցի փողոց",
      mapUrl:
        "https://www.google.com/maps/place/Kecharis+Monastery/@40.5336195,44.7155304,100m/data=!3m1!1e3!4m14!1m7!3m6!1s0x404037290539f92b:0x3386c1118388b29d!2sKecharis+Monastery!8m2!3d40.5338516!4d44.7159767!16zL20vMGdkbmt4!3m5!1s0x404037290539f92b:0x3386c1118388b29d!8m2!3d40.5338516!4d44.7159767!16zL20vMGdkbmt4?entry=ttu&g_ep=EgoyMDI2MDMwMi4wIKXMDSoASAFQAw%3D%3D",
      icon: "/assets/icons/ceremony-champagne.svg"
    },
    {
      id: "party",
      title: "Խնջույք",
      time: "17:30",
      venue: "«Մորենա» ռեստորանային համալիր",
      address: "ք. Մասիս, Մխչյան խճուղի 7/8",
      mapUrl: "https://maps.google.com/?q=40.061,44.424",
      icon: "/assets/icons/party-ring.svg"
    }
  ],
  rsvp: {
    title: "Մասնակցության հաստատում",
    subtitle: "Խնդրում ենք լրացնել մինչև 09.04.26",
    labels: {
      attendingQuestion: "Կկարողանա՞ք ներկա գտնվել միջոցառմանը",
      attendingYes: "Այո, կգամ",
      attendingNo: "Ցավոք, չեմ կարող",
      partsQuestion: "Ում կողմից եք հրավիրված",
      ceremony: "Ադելինայի",
      party: "Արենի",
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
