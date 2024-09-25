from sqlalchemy.inspection import inspect


class Serializer():
    """
    Serializer class for converting SQLAlchemy model instances to dictionaries.

    This class provides a utility for serializing SQLAlchemy model instances into dictionaries.
    It can be used to convert model instances into a format suitable for JSON responses.

    Attributes:
        model_instance: The SQLAlchemy model instance to be serialized.

    Methods:
        serialize: Serializes the model instance into a dictionary.
        serialize_list: Serializes a list of model instances into a list of dictionaries.
    """

    def __init__(self, model_instance):
        """
        Initialize a Serializer instance with a model instance.

        Parameters:
            model_instance: The SQLAlchemy model instance to be serialized.
        """
        self.model_instance = model_instance

    def serialize(self):
        """
        Serialize the model instance into a dictionary.

        Returns:
            dict: A dictionary representing the serialized model instance.
        """
        return {field.key: getattr(self.model_instance, field.key) for field in inspect(self.model_instance).mapper.column_attrs}

    @staticmethod
    def serialize_list(list):
        """
        Serialize a list of model instances into a list of dictionaries.

        Parameters:
            model_list: A list of SQLAlchemy model instances to be serialized.

        Returns:
            list: A list of dictionaries, where each dictionary represents a serialized model instance.
        """
        return [Serializer(model_instance).serialize() for model_instance in list]

    @staticmethod
    def serialize_region_node(region_node):
        return {
            'id': region_node[0],
            'name': region_node[1],
            'upper_region': region_node[2],
            'extend': region_node[3],
            'type_region':region_node[4],
            'level_type':region_node[5]
        }

    @staticmethod
    def serialize_node_regions(node_regions):
        return [Serializer.serialize_region_node(row) for row in node_regions]

    @staticmethod
    def serialize_all_region(region_all):
        return {
            'id': region_all[0],
            'name': region_all[1],
            'upper_region': region_all[2]
        }

    @staticmethod
    def serialize_all_regions(all_regions):
        return [Serializer.serialize_all_region(row) for row in all_regions]
