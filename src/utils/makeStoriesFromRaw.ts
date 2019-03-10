import { Story } from '../entity/Story';

export const makeStories = (raw: any[]) => {
  return raw.map(story => {
    const st = Story.create({ ...story, date: `${story.date}` });
    st.tagIds = story.tags;
    return st;
  });
};
