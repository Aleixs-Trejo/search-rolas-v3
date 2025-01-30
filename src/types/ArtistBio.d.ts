export type ArtistBio = {
  artist: {
    name: string;
    mbid: string;
    url: string;
    image: {
      '#text': string;
      size: string;
    }[];
    streamable: string;
    ontour: string;
    stats: {
      listeners: string;
      playcount: string;
    };
    similar: {
      artist: {
        name: string;
        url: string;
        image: {
          '#text': string;
          size: string;
        }[];
      }[];
    };
    tags: {
      tag: {
        name: string;
        url: string;
      }[];
    };
    bio: {
      links: {
        link: {
          '#text': string;
          rel: string;
          href: string;
        };
      };
      published: string;
      summary: string;
      content: string;
    };
  };
};