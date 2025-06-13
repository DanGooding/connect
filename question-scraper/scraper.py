
from bs4 import BeautifulSoup
import itertools
import re
import requests
import time

def get_walls():
    """ scrape both walls from every episode listed on
        'the only connect database' ocdb.cc

        returns a list of walls, all of the form:
            {
                'series': int,
                'episode': int,
                'symbol': str,
                'groups': [
                    {
                        'connection': str,
                        'clues': [str]
                    }
                ]
            }
    """

    # get all episode links
    r = requests.get('https://ocdb.cc/episodes/')
    assert r.status_code == requests.codes.ok, 'episodes request should succeed'  # pylint: disable=no-member
    soup = BeautifulSoup(r.text, 'html.parser')

    episode_urls = []
    for link_wrapper in soup.find_all(class_='episode_link'):
        episode_urls.append(link_wrapper.a['href'])

    walls = []
    for i, episode_url in enumerate(episode_urls):
        # get the walls for this episode
        print(f'{i + 1:>4} / {len(episode_urls)} : {episode_url}')

        # be polite
        time.sleep(1)

        r = requests.get(episode_url)
        assert r.status_code == requests.codes.ok, 'episode request should succeed'  # pylint: disable=no-member
        soup = BeautifulSoup(r.text, 'html.parser')

        # get the episode and series
        episode_meta = soup.find(class_='episode_meta')
        match = re.search(r'Series\s+(\d+),\s+Episode\s+(\d+)', episode_meta.get_text())
        assert match, f'series and episode number should be present'
        series, episode = match.groups()
        series = int(series)
        episode = int(episode)

        wall_round = soup.find(id='round3')
        wall_wrappers = wall_round.find_next_siblings(class_='question')
        symbol_headings = wall_round.find_next_siblings('h3')
        walls_and_symbols = list(zip(symbol_headings, wall_wrappers))[:2]
        for symbol_heading, wall_wrapper in walls_and_symbols:
            skip_wall = False
            wall = {'series': series, 'episode': episode, 'groups': []}

            # remove any unicode symbols to leave just the name
            symbol_text = symbol_heading.get_text()
            match = re.search(r'(?:alpha|beta|lion|water)+', symbol_text.lower())
            assert match, 'wall should have a valid symbol'
            wall['symbol'] = match.group()

            for group_idx in range(4):
                group = {'clues': []}

                group['connection'] = \
                    wall_wrapper.find(class_=f'group{group_idx + 1}-answer')\
                                .find(class_='back')\
                                .get_text()\
                                .strip()
                
                if not group['connection']:
                    # for at least one group the connection is just blank - handle somewhat gracefully
                    print(f'missing connection - skipping {wall['symbol']} group {group_idx + 1}')
                    skip_wall = True
                    break

                for clue_idx in range(4):
                    group['clues'].append(
                        wall_wrapper.find(class_=f'group{group_idx + 1}-clue{clue_idx + 1}')\
                                    .find(class_='clue')\
                                    .get_text()\
                                    .strip()
                        )
                    assert group['clues'][clue_idx], 'clue should not be empty'
        
                wall['groups'].append(group)
            
            if not skip_wall:
                walls.append(wall)

    return walls
