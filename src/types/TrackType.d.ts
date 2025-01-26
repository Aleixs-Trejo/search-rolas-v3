export type Track = {
  track: {
    name: string;
    mbid: string;
    url: string;
    duration: string;
    streamable: {
      "#text": string;
      fulltrack: string;
    };
    listeners: string;
    playcount: string;
    artist: {
      name: string;
      mbid: string;
      url: string;
    };
    album: {
      artist: string;
      title: string;
      mbid: string;
      url: string;
      image: {
        "#text": string;
        size: string;
      }[];
      "@attr": {
        position: string;
      };
    };
    toptags: {
      tag: {
        name: string;
        url: string;
      }[];
    };
    wiki?: {
      published: string;
      summary: string;
      content: string;
    };
  };
}
