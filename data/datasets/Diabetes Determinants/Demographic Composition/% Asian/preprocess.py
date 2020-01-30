# -*- coding: utf-8 -*-
"""
Created on Wed Oct  9 10:30:29 2019

@author: Zach
"""

import pandas as pd
from tqdm import tqdm
data = pd.read_csv("Utilization Hospitalization Percent Utilization Pediatric Census Tract.csv", sep =",")

for i in tqdm(range(0, len(data["value"]))):
    data["id"][i] = data["id"][i][9:]
data.to_csv("Utilization Hospitalization Percent Utilization Pediatric Census Tract.csv", sep =",")