import { Story } from '../entity/Story';

export const makeStory = (raw: any): Story => {
  const st = Story.create({ ...raw, date: `${raw.date}` });
  st.tagIds = raw.tags;
  return st;
};
