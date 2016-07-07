import json

class DictObject(dict):
    def __init__(self, d={}):
        for k, v in d.iteritems():
            self[k] = v

    def __getattr__(self, attr):
        return self.get(attr)

    def __setattr__(self, attr, value):
        if type(value) is dict:
            d = DictObject()
            for k, v in value.iteritems():
                d[k] = v
            value = d
        super(DictObject, self).__setitem__(attr, value)

    def __setitem__(self, attr, value):
        self.__setattr__(attr, value)


def make_dict_ascii(data):
    if type(data) is dict:
        return dict((k.encode('ascii'), make_dict_ascii(v)) for k, v in data.iteritems())
    else:
        return data

config = DictObject(
            json.load(
                open("./config.json"),
                object_hook=make_dict_ascii
                ));

