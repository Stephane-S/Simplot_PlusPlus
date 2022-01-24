from configparser import ConfigParser
import pathlib

class user_preferences:
    def __init__(self):
        self.pref_filepath = pathlib.Path("stored/user_preferences.ini")
        self.pref_dict = self.load_user_pref()

    def save_pref_dict(self, pref_dict):
        config = ConfigParser()
        for key, value in pref_dict.items():
            config.set("user_preferences", key, value)

        with open(self.pref_filepath, "w") as configfile:
            config.write(configfile)

        print("user preferences saved")


    def load_user_pref(self):
        config = ConfigParser()
        user_pref_dict = self.get_default_preferences()
        if self.pref_filepath.is_file():
            try:
                config.read(self.pref_filepath)
                user_pref_dict["display_ambiguous_warning"] = config.getboolean("user_preferences", "display_ambiguous_warning")
                user_pref_dict["auto_save_sp_qual"] = config.getboolean("user_preferences", "auto_save_sp_qual")
                user_pref_dict["consensus_threshold"] = config.getfloat("user_preferences", "consensus_threshold")
                user_pref_dict["X_grid_lines"] = config.getboolean("user_preferences", "X_grid_lines")
                user_pref_dict["Y_grid_lines"] = config.getboolean("user_preferences", "Y_grid_lines")
                user_pref_dict["normalize_simplot"] = config.getboolean("user_preferences", "normalize_simplot")
                user_pref_dict["nprocs"] = config.getint("user_preferences", "nprocs")
            except Exception:
                print ("error exception preferences")
                self.create_preference_config_file()

        else:
            self.create_preference_config_file()

        return user_pref_dict


    def create_preference_config_file(self, user_pref_dict=None):
        config = ConfigParser()
        if user_pref_dict is None:
            user_pref_dict = {"display_ambiguous_warning": "true",
                              "auto_save_sp_qual": "false",
                              "consensus_threshold": "0.5",
                              "X_grid_lines": "false",
                              "Y_grid_lines": "false",
                              "normalize_simplot": "false",
                              "nprocs": "1"
                              }

        config.add_section("user_preferences")
        for key, value in user_pref_dict.items():
            config.set("user_preferences", key, value)

        # create stored folder if it doesnt exist
        parent_directory_of_file = self.pref_filepath.parent
        parent_directory_of_file.mkdir(parents=True, exist_ok=True)

        with open(self.pref_filepath, "w") as configfile:
            config.write(configfile)

    def get_default_preferences(self):
        user_pref_dict = {"display_ambiguous_warning": True,
                          "auto_save_sp_qual": False,
                          "consensus_threshold": 0.5,
                          "X_grid_lines": False,
                          "Y_grid_lines": False,
                          "normalize_simplot": False,
                          "nprocs": 1
                          }
        return user_pref_dict
