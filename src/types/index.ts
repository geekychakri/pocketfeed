export type FeedListType = {
  feedUrl: string;
  paginationLinks: { self: string };
  title: string;
  description: string;
  image: {
    link: string;
    url: string;
    title: string;
  };
  items: FeedItemType[];
  pubDate: string;
  generator: string;
  link: string;
  language: string;
  copyright: string;
  lastBuildDate: string;
  itunes: {
    owner: {};
    image: string;
    categories: [];
    categoriesWithSubs: [];
    keywords: [];
    author: string;
    summary: string;
    explicit: string;
  };
};

type FeedItemMetadataType = {
  itunes: FeedListType["itunes"];
  feedUrl: string;
  link: string;
  title: string;
  image: FeedListType["image"];
};

export type FeedItemType = {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  creator: string;
  content: string;
  contentSnippet: string;
  "content:encodedSnippet": string;
  guid: string;
  categories?: string;
  isoDate: string;
  author: string;
  "content:encoded": string;
  "podcast:chapters": {
    $: {
      type: string;
      url: string;
    };
  };
  "podcast:transcript": {
    $: {
      type: string;
      url: string;
      rel?: string;
    };
  }[];
  enclosure: {
    length: string;
    type: string;
    url: string;
  };
  itunes: {
    author: string;
    subtitle: string;
    summary: string;
    explicit: string;
    duration: string;
    episode: string;
    episodeType: string;
    image: string;
  };
  feedListMetadata?: FeedItemMetadataType;
};

type UserProfileFormData = {
  fullname: string;
  website: string;
  bio: string;
  birthday: string;
};

type updateProfileActionResponse = {
  type: string;
  message: string;
  errors?: {
    [K in keyof UserProfileFormData]?: string[];
  };
  inputs?: UserProfileFormData;
};

type PFServerActionResponseType = {
  type: "success" | "user-error" | "internal-error";
  message: string;
};

type BookmarkType = {
  type: string;
  bookmarkId: string;
  isBookmarkExists: boolean;
};
