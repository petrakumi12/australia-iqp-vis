import pandas as pd
import numpy as np
import more_itertools as mit

path = r"C:\Users\Petra Kumi\IdeaProjects\AustraliaD18-dataviz\resources\MPC-ECO-D18-data\Info.csv"


# to will mean to eco center, from means from eco center
def fix_data():
    df = pd.read_csv(path)
    df.fillna(0, inplace=True)
    # df.replace(, None)
    # print(df)
    # print(df.columns)
    arr = ['Advocacy Direction', 'Research Direction', 'Events Direction', 'Networking Direction',
           'consulting Direction', 'publicity direction']
    direction_df = df[['Label']].copy()
    print(len(direction_df))
    val = to_from_per_col(df[arr])
    direction_df.insert(1, 'direction', val)
    direction_df = direction_df[direction_df.direction != 'False']
    print(direction_df)  # array of all directions

    final_arr = [(None, None)]
    for element in direction_df[['Label', 'direction']].iterrows():
        loc = element[1][0].replace("\"", "")
        dir = element[1][1]
        if dir == 'from':
            final_arr.append(('EcoCentre', loc))
        elif dir == 'to':
            final_arr.append((loc, 'EcoCentre'))
        else:
            final_arr.append(('EcoCentre', loc))
            final_arr.append((loc, 'EcoCentre'))
    final_arr.remove((None, None))
    final_df = pd.DataFrame(data=final_arr, columns=['from', 'to'])
    print(final_df)
    new_csvpath = r"C:\Users\Petra Kumi\IdeaProjects\AustraliaD18-dataviz\resources\MPC-ECO-D18-data\to_from.csv"
    pd.DataFrame.to_csv(final_df, new_csvpath)


def get_names():
    df = pd.read_csv(path)
    df.fillna(0, inplace=True)
    final_df = df[['Label','Organization Type','Effort (Hours)']]
    final_df = final_df[final_df != 0]
    names_csvpath = r"C:\Users\Petra Kumi\IdeaProjects\AustraliaD18-dataviz\resources\MPC-ECO-D18-data\all_names.csv"
    pd.DataFrame.to_csv(final_df, names_csvpath)


def to_from_dummy():
    df = pd.read_csv(path)
    df.fillna(0, inplace=True)
    final_df = df[['Label']].copy()
    final_df = final_df[final_df['Label'] != 0]
    print(len(final_df))
    final_df.insert(0, 'source', ['EcoCentre' for i in range(len(final_df['Label']))])
    names_csvpath = r"C:\Users\Petra Kumi\IdeaProjects\AustraliaD18-dataviz\resources\MPC-ECO-D18-data\dummy.csv"
    pd.DataFrame.to_csv(final_df, names_csvpath)

    print(final_df)


def to_from_per_col(filtered_df):
    val = [None]
    for row in filtered_df.iterrows():
        row_vals = list(row[1])
        # print(row_vals)
        if ('to' in row_vals and 'false' in row_vals) or 'both' in row_vals:
            val.append('both')
        else:
            val.append(mit.first_true(row_vals, pred=lambda x: x is not 0))
    val.remove(None)
    print(len(np.array(val)))
    return np.array(val)


# fix_data()
get_names()
# to_from_dummy()
