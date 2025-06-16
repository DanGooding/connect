import certifi
import pymongo
from scraper import get_walls
import os
from dotenv import load_dotenv
load_dotenv()

symbol_indices = {
    'alpha': 0,
    'beta': 1,
    'lion': 0,
    'water': 1
}

if __name__ == '__main__':

    connection_string = os.getenv('DB_URL') or 'mongodb://localhost:27017'
    client = pymongo.MongoClient(connection_string, tlsCAFile=certifi.where())
    db = client['connect']
    print(f'connected to {client}')

    # idempotent: no risk of duplicate index
    db.walls.create_index([
        ('series', pymongo.ASCENDING),
        ('episode', pymongo.ASCENDING),
        ('symbolIndex', pymongo.ASCENDING)
    ], unique=True, name='releaseOrder')

    # save walls as documents of the form:
    # _id included automatically
    # {
    #     'series': int,
    #     'episode': int,
    #     'symbolName': str,
    #     'symbolIndex': int,
    #     'groups': [
    #         {
    #             'connection': str,
    #             'clues': [str]
    #         }
    #     ]
    # }

    walls = get_walls()
    for wall in walls:
        wall['symbolName'] = wall['symbol']
        wall['symbolIndex'] = symbol_indices[wall['symbol']]
        del wall['symbol']

    result = db.walls.insert_many(walls)
    
    print(f'{len(result.inserted_ids)} of {len(walls)} inserted')


