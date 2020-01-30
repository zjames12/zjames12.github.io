import os
import csv
import json

directory = os.getcwd()
county_descriptor = directory+'\\county_names.csv'

description_json = directory + '\\descriptions.json'
unused_description_json = directory + '\\unusued_descriptions.json'

source_json1 = directory + '\\source1.json'
source_json2 = directory + '\\source2.json'

folder_tree_json = directory + '\\folder_tree.json'

def export_descriptions():
    '''will export description json to a txt file which is more readable'''
    with open(description_json) as data_file:    
        data = json.load(data_file)
    text = ''
    keys = list(data.keys())
    keys.sort()
    for i in keys:
        if 'datasets/' in i:
            text += i +'\n' + data[i] + '\n\n'
    with open(directory+'\\out.txt','w') as f:
        f.write(text)

def recreate_folder_tree():
    ''' recreates folder data tree that JavaScript uses'''
    data = _create_folders(directory+'\\datasets')
    with open(folder_tree_json, 'w') as data_file:
        json.dump(data, data_file)

def _create_folders(d):
    data = {}
    files = []
    for i in os.listdir(d):
        if '.' not in i:
            data[i] = _create_folders(d+'\\'+i)
        elif '.csv' in i:
            files.append(i)
    if files != []:
        return files
    else:
        return data
        
def edit_description(file_name, ):
    '''Given a file in the data directory (key to descriptions.json), will add new description'''
    with open(description_json) as data_file:    
        data = json.load(data_file)
    if file_name not in data:
        print('this is not a valid description name')
        if input('Would you like to add it(y/n') != 'y':
            return
        data[file_name] = ''
    print('Old value:\t',data[file_name])
    data[file_name] = input('New value:')
    with open(description_json, 'w') as data_file:
        json.dump(data, data_file)


    
def check_description_json():
    ''' will go through descriptions.json  and remove old descriptions and add new ones for new data'''
    with open(description_json) as data_file:    
        data = json.load(data_file)
    clean_descriptions = {}
    missing_descriptions = []
    for root, dirs, files in os.walk(directory):
        for name in files:
            if '.csv' in name and 'not used' not in str(root) and 'counties' not in name and 'county_names' not in name:
                key = root.replace(directory+'\\','') + '\\' + name.replace('.csv','')
                key = key.replace('\\','/')
                if key in data:
                    clean_descriptions[key] = data[key]
                else:
                    missing_descriptions.append(key)

    # descriptions in descriptions.json that don't have a file assosciated with them are moved to unused_descriptions.json
    with open(unused_description_json) as data_file:    
        unused_data = json.load(data_file)
    count = 0
    for i in data:
        if i not in clean_descriptions:
            unused_data[i] = data[i]
            count += 1
    print(type(unused_data), len(unused_data))
    with open(unused_description_json,'w') as data_file:
        json.dump(unused_data, data_file)
    print(count, ' descriptions moved to unusued json')
    
    # files without a description are prompted
    print(len(missing_descriptions), ' descriptions currently missing')
    print('Enter a description string for each directory prompted, OR hit ENTER to skip')
    count = 0 
    for i in missing_descriptions:
        value = input(i)
        if value != '':
            clean_descriptions[i] = value
            count += 1
    with open(description_json, 'w') as data_file:
        json.dump(clean_descriptions, data_file)
    print(count, ' descriptions added')
    print(len(missing_descriptions)-count, ' descriptions still missing')

    
def check_source_json2():
    ''' will go through source2.json  and add new ones for new data in the Comparative tab'''
    with open(source_json2) as data_file:    
        data = json.load(data_file)
    missing_source = []
    for root, dirs, files in os.walk(directory+'\\Comparative'):
        for name in files:
            if '.csv' in name and 'not used' not in str(root) and 'counties' not in name and 'county_names' not in name:
                key = root.replace(directory+'\\','') + '\\' + name.replace('.csv','')
                key = key.replace('\\','/')
                if key not in data:
                    missing_source.append(key)
    print(len(missing_source), ' sources currently missing')
    print('Enter a source description string for each directory prompted, OR hit ENTER to skip')
    count = 0 
    for i in missing_source:
        value = input(i)
        if value == 'acs':
            data[i] = "2011-2015 <a href='https://www.census.gov/programs-surveys/acs/'>US Census Bureau American Community Survey (ACS)</a> 5-Year Estimates for 2015"
            count+=1
        elif value != '':
            data[i] = value
            count += 1
    with open(source_json2, 'w') as data_file:
        json.dump(data, data_file)
    print(count, ' sources added')
    print(len(missing_source)-count, ' sources still missing')

def check_source_json():
    ''' will go through source1.json  and add new ones for new data in the Healthcare Measures tab'''
    with open(source_json1) as data_file:    
        data = json.load(data_file)
    missing_source = []

    for folder in ('Access', 'Prevalence', 'Utilization', 'Outcome', 'Insurance'):
        for root, dirs, files in os.walk(directory+'\\'+folder):
            for name in files:
                if '.csv' in name and 'not used' not in str(root) and 'counties' not in name and 'county_names' not in name:
                    key = root.replace(directory+'\\','') + '\\' + name.replace('.csv','')
                    key = key.replace('\\','/')
                    if key not in data:
                        missing_source.append(key)
    print(len(missing_source), ' sources currently missing')
    print('Enter a source description string for each directory prompted, OR hit ENTER to skip')
    count = 0 
    for i in missing_source:
        value = input(i)
        if value == 'acs':
            data[i] = "2011-2015 <a href='https://www.census.gov/programs-surveys/acs/'>US Census Bureau American Community Survey (ACS)</a> 5-Year Estimates for 2015"
            count+=1
        elif value != '':
            data[i] = value
            count += 1
    with open(source_json1, 'w') as data_file:
        json.dump(data, data_file)
    print(count, ' sources added')
    print(len(missing_source)-count, ' sources still missing')
                    

  





def add_descriptions_all(folder):
    ''' adds county desriptions to all csvs within a folder'''
    print('adding descriptions for ',directory+'\\'+folder)
    for root, dirs, files in os.walk(directory+'\\'+folder):
        for name in files:
            #print(root+'\\'+name)
            if '.csv' in name:
                add_descriptor(root+'\\'+name)

                
def add_descriptor(filename):
    ''' adds county names to filepath'''
    county_names = {}
    with open(county_descriptor, 'r') as csvfile:
        csvreader = csv.reader(csvfile, delimiter=',')
        for row in csvreader:
            if row == ['GEOID', 'Longitude', 'Latitude', 'County', 'id', 'value'] or row ==['', '', '', '', '', '']:
                continue
            elif 'unit' in row:
                continue
            county_names[int(row[0][2:5])] = row[3]

    
    new_data = []
    with open(filename, 'r') as csvfile:
        
        csvreader = csv.reader(csvfile, delimiter=',')
        col = None
        for row in csvreader:
            #print(row,col)
            if col is None:
                if 'county' in row:
                    return
                elif 'id' in row:
                    col = row.index('id')
                    new_data.append(['county']+row)
                else:
                    print(row)
                    print('No id column in '+filename)
                    raise
            elif 'unit' in row:
                new_data.append(['']+row)
            else:
                if row[col] == 0 or row[col]=='0' or row[col]=='13999':
                    new_data.append(['Unknown']+row)
                elif ''.join(row) == '':
                    continue
                else:
                    try:
                        new_row = [county_names[int(row[col][2:5])]] + row
                        new_data.append(new_row)
                    except:
                        print(filename)
                        print('Error with row: ',row)
                        return

            
    with open(filename, 'w') as csvfile:
        csvwriter = csv.writer(csvfile, delimiter=',', lineterminator = '\n')
        for row in new_data:
            csvwriter.writerow(row)
        
recreate_folder_tree()

