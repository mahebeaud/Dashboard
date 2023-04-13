import { Request, Response } from 'express';
import { BadRequestException } from '../../utils/exceptions';

export class AboutService {
  async getAbout(req: Request, res: Response): Promise<void> {
    res.setHeader('Content-Type', 'application/json');
    try {
      const current_time = Math.floor(Date.now() / 1000);
      const data = {
        "client": {
          "host": `${process.env.CLIENT_URL}`
        },
        "server": {
          "current_time": current_time,
          "services": [
            {
              "name": "weather",
              "widgets": [
                {
                  "name": "city_temperature",
                  "description": "Display temperature for a city",
                  "params": [
                    {
                      "name": "city",
                      "type": "string"
                    }
                  ]
                },
              ]
            }, {
              "name": "youtube",
              "widgets": [
                {
                  "name": "channel_name",
                  "description": "Display the name of the channel of the video V",
                  "params": [
                    {
                      "name": "videoID",
                      "type": "string"
                    }
                  ]
                },
                {
                  "name": "video_views",
                  "description": "View number of views for video V",
                  "params": [
                    {
                      "name": "videoID",
                      "type": "string"
                    }
                  ]
                },
                {
                  "name": "video_like",
                  "description": "View number of likes for video V",
                  "params": [
                    {
                      "name": "videoID",
                      "type": "string"
                    }
                  ]
                },
                {
                  "name": "video_title",
                  "description": "",
                  "params": [
                    {
                      "name": "videoID",
                      "type": "string"
                    }
                  ]
                }
              ]
            },
            {
              "name": "Reddit",
              "widgets": [
                {
                  "name": "subreddit_post",
                  "description": "Display of the last N posts for subreddit S",
                  "params": [
                    {
                      "name": "subreddit_name",
                      "type": "string"
                    },
                    {
                      "name": "number_of_posts",
                      "type": "number"
                    }
                  ]
                },
              ]
            }
          ]
        }
      };
      res.send(JSON.stringify(data));
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  }
}
