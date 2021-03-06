#  these colors were taken from Tatarize's work and consist of 256 distinct colors

import sys
#  https://stackoverflow.com/questions/33295120/how-to-generate-gif-256-colors-palette
#  http://godsnotwheregodsnot.blogspot.com/2012/09/color-distribution-methodology.html


def get_RGB_list():
    rgb_list = ['#E20027', '#5B113C', '#FF34FF', "#0000A6", '#494B5A', '#0086ED', '#BC65E9', '#00C2A0', '#006C31',
                  '#7ED379', '#C6DC99', '#61615A', '#A77500', '#CA834E', '#FFAA92', '#FFDBE5',
                  '#C8A1A1', '#C6005A', '#E773CE', '#B5F4FF', '#958A9F', '#00489C', '#404E55', '#006A66', '#8ADBB4',
                  '#D2DCD5', '#4FC601', '#222800', '#F4D749', '#FAD09F', '#A05837', '#1E0200',
                  '#B88183', '#922329', '#5A0007', '#D7BFC2', '#D86A78', '#FF8A9A', '#3B000A', '#943A4D', '#5B4E51',
                  '#B05B6F', '#FEB2C6', '#D83D66', '#895563', '#FF1A59',
                  '#CC0744', '#CB7E98', '#997D87', '#6A3A4C', '#FF2F80', '#6B002C', '#A74571', '#FF5DA7', '#300018',
                  '#B894A6', '#FF90C9', '#7C6571', '#A30059', '#DA007C',
                  '#402334', '#D157A0', '#DDB6D0', '#885578', '#962B75', '#A97399', '#D20096', '#AA5199', '#E704C4',
                  '#6B3A64', '#FFA0F2', '#6F0062', '#B903AA', '#C895C5',
                  '#320033', '#DBD5DD', '#EEC3FF', '#BC23FF', '#671190', '#201625', '#F5E1FF', '#D790FF', '#72418F',
                  '#4A3B53', '#9556BD', '#B4A8BD', '#7900D7', '#A079BF',
                  '#837393', '#64547B', '#3A2465', '#353339', '#BCB1E5', '#9F94F0', '#9695C5', '#000035', '#636375',
                  '#00005F', '#97979E', '#7A7BFF', '#3C3E6E', '#6367A9',
                  '#3B5DFF', '#C8D0F6', '#6D80BA', '#8FB0FF', '#0045D2', '#7A87A1', '#324E72', '#0060CD', '#789EC9',
                  '#012C58', '#99ADC0', '#001325', '#DDEFFF', '#59738A',
                  '#75797C', '#BDC9D2', '#3E89BE', '#8CD0FF', '#0AA3F7', '#6B94AA', '#29607C', '#006FA6', '#013349',
                  '#0AA6D8', '#658188', '#5EBCD1', '#456D75', '#0089A3',
                  '#02525F', '#1CE6FF', '#001C1E', '#203B3C', '#A3C8C9', '#00A6AA', '#00C6C8', '#518A87', '#E4FFFC',
                  '#66E1D3', '#004D43', '#809693', '#15A08A', '#00846F',
                  '#00FECF', '#78AFA1', '#02684E', '#C2FFED', '#47675D', '#00D891', '#004B28', '#0CBD66', '#549E79',
                  '#1A3A2A', '#6C8F7D', '#008941', '#63FFAC', '#1BE177',
                  '#B5D6C3', '#3D4F44', '#4B8160', '#66796D', '#71BB8C', '#04F757', '#001E09', '#00B433', '#9FB2A4',
                  '#003109', '#A3F3AB', '#456648', '#51A058', '#83A485',
                  '#D1F7CE', '#A1C299', '#061203', '#1E6E00', '#5EFF03', '#55813B', '#3B9700', '#1B4400', '#C2FF99',
                  '#788D66', '#868E7E', '#83AB58', '#374527', '#98D058',
                  '#A4E804', '#76912F', '#8BB400', '#34362D', '#4C6001', '#DFFB71', '#6A714A', '#6B7900', '#3A3F00',
                  '#BEC459', '#FEFFE6', '#A3A489', '#9FA064', '#FFFF00',
                  '#FFFFFE', '#9B9700', '#CFCDAC', '#797868', '#575329', '#FFF69F', '#8D8546', '#7E6405', '#1D1702',
                  '#CCAA35', '#CCB87C', '#453C23', '#513A01', '#FFB500',
                  '#D68E01', '#B79762', '#7A4900', '#372101', '#886F4C', '#A45B02', '#E7AB63', '#C0B9B2', '#938A81',
                  '#A38469', '#D16100', '#A76F42', '#5B4534', '#5B3213',
                  '#FF913F', '#953F00', '#D0AC94', '#7D5A44', '#BE4700', '#FDE8DC', '#772600', '#EA8B66', '#391406',
                  '#FF6832', '#C86240', '#29201D', '#B77B68', '#806C66',
                  '#89412E', '#E83000', '#A88C85', '#F7C9BF', '#643127', '#E98176', '#7B4F4B', '#9C6966', '#BF5650',
                  '#BA0900', '#FF4A46', '#F4ABAA', '#000000', '#452C2C'
                  ]

    return rgb_list


# rgb_list = ["#000000", "#FFFF00", "#1CE6FF", "#FF34FF", "#FF4A46", "#008941", "#006FA6", "#A30059",
#             "#FFDBE5", "#7A4900", "#0000A6", "#63FFAC", "#B79762", "#004D43", "#8FB0FF", "#997D87",
#             "#5A0007", "#809693", "#FEFFE6", "#1B4400", "#4FC601", "#3B5DFF", "#4A3B53", "#FF2F80",
#             "#61615A", "#BA0900", "#6B7900", "#00C2A0", "#FFAA92", "#FF90C9", "#B903AA", "#D16100",
#             "#DDEFFF", "#000035", "#7B4F4B", "#A1C299", "#300018", "#0AA6D8", "#013349", "#00846F",
#             "#372101", "#FFB500", "#C2FFED", "#A079BF", "#CC0744", "#C0B9B2", "#C2FF99", "#001E09",
#             "#00489C", "#6F0062", "#0CBD66", "#EEC3FF", "#456D75", "#B77B68", "#7A87A1", "#788D66",
#             "#885578", "#FAD09F", "#FF8A9A", "#D157A0", "#BEC459", "#456648", "#0086ED", "#886F4C",
#             "#34362D", "#B4A8BD", "#00A6AA", "#452C2C", "#636375", "#A3C8C9", "#FF913F", "#938A81",
#             "#575329", "#00FECF", "#B05B6F", "#8CD0FF", "#3B9700", "#04F757", "#C8A1A1", "#1E6E00",
#             "#7900D7", "#A77500", "#6367A9", "#A05837", "#6B002C", "#772600", "#D790FF", "#9B9700",
#             "#549E79", "#FFF69F", "#201625", "#72418F", "#BC23FF", "#99ADC0", "#3A2465", "#922329",
#             "#5B4534", "#FDE8DC", "#404E55", "#0089A3", "#CB7E98", "#A4E804", "#324E72", "#6A3A4C"]

# rgb_list_1 = ['#B88183', '#922329', '#5A0007', '#D7BFC2', '#D86A78', '#FF8A9A', '#3B000A', '#943A4D', '#5B4E51', '#B05B6F', '#FEB2C6', '#D83D66', '#895563', '#FF1A59',
#             '#CC0744', '#CB7E98', '#997D87', '#6A3A4C', '#FF2F80', '#6B002C', '#A74571', '#FF5DA7', '#300018', '#B894A6', '#FF90C9', '#7C6571', '#A30059', '#DA007C',
#             '#402334', '#D157A0', '#DDB6D0', '#885578', '#962B75', '#A97399', '#D20096', '#AA5199', '#E704C4', '#6B3A64', '#FFA0F2', '#6F0062', '#B903AA', '#C895C5',
#             '#320033', '#DBD5DD', '#EEC3FF', '#BC23FF', '#671190', '#201625', '#F5E1FF', '#D790FF', '#72418F', '#4A3B53', '#9556BD', '#B4A8BD', '#7900D7', '#A079BF',
#             '#837393', '#64547B', '#3A2465', '#353339', '#BCB1E5', '#9F94F0', '#9695C5', '#000035', '#636375', '#00005F', '#97979E', '#7A7BFF', '#3C3E6E', '#6367A9',
#             '#3B5DFF', '#C8D0F6', '#6D80BA', '#8FB0FF', '#0045D2', '#7A87A1', '#324E72', '#0060CD', '#789EC9', '#012C58', '#99ADC0', '#001325', '#DDEFFF', '#59738A',
#             '#75797C', '#BDC9D2', '#3E89BE', '#8CD0FF', '#0AA3F7', '#6B94AA', '#29607C', '#006FA6', '#013349', '#0AA6D8', '#658188', '#5EBCD1', '#456D75', '#0089A3',
#             '#02525F', '#1CE6FF', '#001C1E', '#203B3C', '#A3C8C9', '#00A6AA', '#00C6C8', '#518A87', '#E4FFFC', '#66E1D3', '#004D43', '#809693', '#15A08A', '#00846F',
#             '#00FECF', '#78AFA1', '#02684E', '#C2FFED', '#47675D', '#00D891', '#004B28', '#0CBD66', '#549E79', '#1A3A2A', '#6C8F7D', '#008941', '#63FFAC', '#1BE177',
#             '#B5D6C3', '#3D4F44', '#4B8160', '#66796D', '#71BB8C', '#04F757', '#001E09', '#00B433', '#9FB2A4', '#003109', '#A3F3AB', '#456648', '#51A058', '#83A485',
#             '#D1F7CE', '#A1C299', '#061203', '#1E6E00', '#5EFF03', '#55813B', '#3B9700', '#1B4400', '#C2FF99', '#788D66', '#868E7E', '#83AB58', '#374527', '#98D058',
#             '#A4E804', '#76912F', '#8BB400', '#34362D', '#4C6001', '#DFFB71', '#6A714A', '#6B7900', '#3A3F00', '#BEC459', '#FEFFE6', '#A3A489', '#9FA064', '#FFFF00',
#             '#FFFFFE', '#9B9700', '#CFCDAC', '#797868', '#575329', '#FFF69F', '#8D8546', '#7E6405', '#1D1702', '#CCAA35', '#CCB87C', '#453C23', '#513A01', '#FFB500',
#             '#D68E01', '#B79762', '#7A4900', '#372101', '#886F4C', '#A45B02', '#E7AB63', '#C0B9B2', '#938A81', '#A38469', '#D16100', '#A76F42', '#5B4534', '#5B3213',
#             '#FF913F', '#953F00', '#D0AC94', '#7D5A44', '#BE4700', '#FDE8DC', '#772600', '#EA8B66', '#391406', '#FF6832', '#C86240', '#29201D', '#B77B68', '#806C66',
#             '#89412E', '#E83000', '#A88C85', '#F7C9BF', '#643127', '#E98176', '#7B4F4B', '#9C6966', '#BF5650', '#BA0900', '#FF4A46', '#F4ABAA', '#000000', '#452C2C']