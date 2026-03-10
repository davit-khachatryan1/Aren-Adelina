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
  siteUrl: "https://aren-adelina.vercel.app/",
  seo: {
    title: "Արենի և Ադելինայի հարսանեկան հրավերք",
    description:
      "Սիրով հրավիրում ենք ձեզ Արենի և Ադելինայի հարսանիքին՝ կիսելու մեզ հետ այս հատուկ օրը։",
    imageUrl: "https://aren-adelina.vercel.app/assets/social/og-card.jpg",
    imageAlt: "Արեն և Ադելինա",
  },
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
      layer: "primary",
    },
    {
      src: "/assets/images/story-desktop-2.jpg",
      alt: "Զույգի լուսանկար 2",
      desktopObjectPosition: "54% 28%",
      mobileObjectPosition: "53% 30%",
      layer: "secondary",
    },
    {
      src: "/assets/images/arenAdel.jpg",
      alt: "Զույգի լուսանկար 3",
      desktopObjectPosition: "50% 24%",
      mobileObjectPosition: "50% 24%",
    },
    {
      src: "/assets/images/ArenAdel1.jpg",
      alt: "Զույգի լուսանկար 4",
      desktopObjectPosition: "50% 22%",
      mobileObjectPosition: "50% 22%",
    },
    {
      src: "/assets/images/arenadel2.jpg",
      alt: "Զույգի լուսանկար 5",
      desktopObjectPosition: "50% 24%",
      mobileObjectPosition: "50% 24%",
    },
  ],
  musicFile: "/assets/audio/talking-to-the-moon.mp3",
  rsvpEndpoint: import.meta.env?.VITE_RSVP_ENDPOINT ?? "/rsvp",
  ctaLabel: "Պատասխանել",
  intro: {
    title: "Դուք հրավիրված եք մեր հարսանիքին",
    tapHint: "Բացեք ծրարը",
    footer:
      "Այս հրավերը Դուք պատահական չեք ստացել։\nՄեզ համար հատկապես կարևոր է, որ այս յուրահատուկ օրը մեր կողքին լինեն ամենամտերիմ մարդիկ։",
  },
  story: {
    title: "Սիրելի հարազատներ և ընկերներ",
    description:
      "Սիրով հրավիրում ենք ձեզ մեր հարսանյաց արարողությանը՝ կիսելու մեր կյանքի այդ լուսավոր օրը։",
  },
  scheduleTitle: "Օրվա ծրագիրը",
  events: [
    {
      id: "ceremony",
      title: "Պսակադրություն",
      time: "15:30",
      venue: "Կեչառիսի վանական համալիր",
      address: "Խաչատուր Կեչառեցի փողոց",
      mapLinks: {
        google:
          "https://www.google.com/maps/place/Kecharis+Monastery/@40.5336195,44.7155304,100m/data=!3m1!1e3!4m14!1m7!3m6!1s0x404037290539f92b:0x3386c1118388b29d!2sKecharis+Monastery!8m2!3d40.5338516!4d44.7159767!16zL20vMGdkbmt4!3m5!1s0x404037290539f92b:0x3386c1118388b29d!8m2!3d40.5338516!4d44.7159767!16zL20vMGdkbmt4?entry=ttu&g_ep=EgoyMDI2MDMwMi4wIKXMDSoASAFQAw%3D%3D",
      },
      icon: "/assets/icons/party-ring.svg",
    },
    {
      id: "party",
      title: "Խնջույք",
      time: "17:30",
      venue: "«Պալաիս» ռեստորանային համալիր",
      address: "Ք.Հրազդան,Չարենցի փողոց 3",
      mapLinks: {
        google: "https://maps.app.goo.gl/GsqjKRCgSQDJpF876",
        yandex:
          "https://yandex.com/maps/org/palais_wedding_hall/202867135433/?ll=44.753757%2C40.500713&utm_source=share&z=18",
      },
      icon: "/assets/icons/ceremony-champagne.svg",
    },
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
      errorFallback: "Չհաջողվեց ուղարկել։ Փորձեք կրկին։",
    },
  },
  info: {
    title: "ԿԱՐԵՎՈՐ",
    paragraphs: [
      "Հարգելի հյուրեր, խնդրում ենք ներկայանալ ժամանակին։",
      "Խնդրում ենք պահպանել տոնական տրամադրությունը և ժպիտը։",
    ],
  },
};

export const assertWeddingConfig = (input: WeddingConfig): WeddingConfig => {
  if (!input.siteUrl.trim()) {
    throw new Error("siteUrl is required");
  }
  try {
    new URL(input.siteUrl);
  } catch {
    throw new Error("siteUrl must be an absolute URL");
  }
  if (!input.seo.title.trim()) {
    throw new Error("seo.title is required");
  }
  if (!input.seo.description.trim()) {
    throw new Error("seo.description is required");
  }
  if (!input.seo.imageAlt.trim()) {
    throw new Error("seo.imageAlt is required");
  }
  if (!input.seo.imageUrl.trim()) {
    throw new Error("seo.imageUrl is required");
  }
  try {
    new URL(input.seo.imageUrl);
  } catch {
    throw new Error("seo.imageUrl must be an absolute URL");
  }
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
  if (input.storyImages.some((image) => !image.src.trim())) {
    throw new Error("Each story image must include src");
  }
  if (input.events.length < 1) {
    throw new Error("At least one event is required");
  }
  if (
    input.events.some((event) => {
      const mapLinks = Object.values(event.mapLinks).filter(
        (url): url is string =>
          typeof url === "string" && url.trim().length > 0,
      );
      return mapLinks.length === 0;
    })
  ) {
    throw new Error("Each event must include at least one map link");
  }
  return input;
};
