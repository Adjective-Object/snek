import json

class DictObject(object):
    
    def __init__(self, content):
        self.content = content

    def __getattr__(self, attr):
        return self.content.get(attr)


config = DictObject(
            json.load(
                open("./config.json")
                ));
