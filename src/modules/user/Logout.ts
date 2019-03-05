import { Resolver, Mutation, Ctx } from 'type-graphql';

import { IContext } from '../../types/IContext';

@Resolver()
export class LogoutResolver {
  @Mutation(returns => Boolean)
  logout(@Ctx() { req, res }: IContext): Promise<boolean> {
    return new Promise((resolve, reject) => {
      req.session!.destroy(err => {
        if (err) return resolve(false);
      });
      res.clearCookie('rid');
      resolve(true);
    });
  }
}
