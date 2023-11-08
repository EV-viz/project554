### import library
import pandas as pd

### import raw data
data = pd.read_csv('population.csv',index_col=0)

# delete rows with missing values
data.dropna(inplace=True)

# separate "Vehicle Location" column into two columns: latitude, longitude
data['Vehicle Location'] = data['Vehicle Location'].str[7:-1]
coordinates = data['Vehicle Location'].str.split(" ",n=1)
data['latitude'] = coordinates.str[0]
data['longtitude'] = coordinates.str[1]
# drop 'vehicle location' column
data.drop(columns=['Vehicle Location'], axis=1, inplace=True)

# change column values from string to float
data['latitude'] = data['latitude'].astype(float)
data['longtitude'] = data['longtitude'].astype(float)

# change column values from float to integer
data['Postal Code'] = data['Postal Code'].astype(int)
data['2020 Census Tract'] = data['2020 Census Tract'].astype(int)
data['Legislative District'] = data['Legislative District'].astype(int)

data.to_csv("cleaned_population.csv")