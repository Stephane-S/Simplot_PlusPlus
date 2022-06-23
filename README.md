﻿﻿﻿﻿﻿﻿﻿<h1  align="center"> SimPlot++ <p align='center'> [![Hits](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2FStephane-S%2FSimplot_PlusPlus&count_bg=%2379C83D&title_bg=%23555555&icon=&icon_color=%23D9D9D9&title=hits&edge_flat=false)](https://hits.seeyoufarm.com) </p>

<h2  align="center">Multi-platform application for representing sequence similarity and detecting recombination</h2>

<details open>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About the project</a>
    </li>
    <li>
      <a href="#Installation">Installation</a>
      <ul>
        <li><a href="#Windows-version">Windows version</a></li>
        <li><a href="#Linux-UNIX-and-Mac-OS-versions">Linux/UNIX and Mac OS versions</a></li>
      </ul>
    </li>
    <li> Available analyses</li>
      <ul>
        <li><a href="#Group-creation">Group creation</a></li>
        <li><a href="#SimPlot-analysis">SimPlot analysis</a></li>
        <li><a href="#Similarity-networks">Similarity networks</a></li>
        <li><a href="#BootScan-analysis">BootScan analysis</a></li>
        <li><a href="#Findsites">Findsites</a></li>
        <li><a href="#Detection-of-recombination">Detection of recombination</a></li>
      </ul>
    <li>
      <a href="#contact">Contact</a>
    </li>
  </ol>
</details>



# About the project

Simplot++ is an open-source multi-platform application designed by Stéphane Samson, Étienne Lord and Vladimir Makarenkov (Université du Québec à Montréal). It is implemented in Python. SimPlot++ produces publication-ready SimPlot and plots using 43 nucleotide and 20 amino acid distance models. Intergenic and intragenic recombination events can be identified using Phi, χ2, NSS and Proportion tests. 
Simplot++ also generates and analyzes interactive sequence similarity networks, while supporting multi-processing and providing distance calculability diagnostics.

SimPlot++ offers the following features:

- Create and save consensus sequences (representing a given sequence group)
- Run a SimPlot (sequence similarity plot) analysis
- Run a BootScan analysis  
- Identify informative sites  
- Create and analyze sequence similarity networks
- Run Phi, NSS and χ2 statistical tests to detect recombination
- Provide distance calculability diagnostics

**Reference:** [S Samson, É Lord, V Makarenkov (2022), SimPlot++: a Python application for representing sequence similarity and detecting recombination.
Bioinformatics 38 (11), 3118–3120](https://academic.oup.com/bioinformatics/article-abstract/38/11/3118/6572334?redirectedFrom=fulltext)

[![alt text][1]][2]

[1]: https://github.com/Stephane-S/Simplot_PlusPlus/blob/master/Docs/images/PDF_icon.svg
[2]: https://arxiv.org/ftp/arxiv/papers/2112/2112.09755.pdf

# Installation
## Windows version

SimPlot++ for Windows is available either as an [executable file](https://github.com/Stephane-S/Simplot_PlusPlus/releases) or as a Python script.

### Executable
The Windows installer can be found at the [release](https://github.com/Stephane-S/Simplot_PlusPlus/releases). Click on the `SimPlot++-x.x-win64.msi` file to download it.

### Python script
A `requirements.txt` file containing all required libraries is available in the GitHub repository.

Assuming Python 3.8 or higher is installed on the machine, the script should run well with the libraries installed.

<u>Here is an example of how to run the script in Windows:</u>
1. After downloading the source code, go to the folder containing `main.py`.
1. Create a new virtual environment (venv) in your Windows PowerShell using `python3 -m venv SimPlot++_venv `.
2. Still in the PowerShell, enter the new venv using `SimPlot++_env/Scripts/Activate.ps1`.
3. Install the required libraries using `pip install -r requirements.txt`.
4. Launch SimPlot++ using `python3 main.py`.

## Linux UNIX and Mac OS versions
SimPlot++ is available as a Python script.

### Python script
A `requirements.txt` file containing all required libraries is available in the GitHub repository.

Assuming Python 3.8 or higher is installed on the machine, the script should run well with the libraries installed.

<u>Here is an example of how to run the script in Linux/UNIX or Mac OS:</u>
1. After downloading the source code, go to the folder containing `main.py`.
2. If you do not have `virtualenv` installed, run `python3 -m pip install --user virtualenv`
3. Create a new virtual environment (venv) in your terminal using `python3 -m venv SimPlot++_env`.
4. Still in the terminal, enter the new venv using `source SimPlot++_env/bin/activate`.
5. Install the required libraries using `python3 -m pip install -r requirements.txt`.
6. Launch SimPlot++ using `python3 main.py`.



# Getting started

## Group creation
The group page allows users to load multiple sequences files (in the Fasta, Nexus, Pir, Phylip, Stockholm or Clustal format) and manually organize individual sequences in groups. For each of the groups created by the user, a consensus sequence will be generated by SimPlot++. The % threshold for consensus sequences can be modified in the preference tab of the menu. 
The consensus groups are essential for the SimPlot, BootScan and Network Similarity analyses. The groups can be saved in a Nexus file to avoid recreating them every time.

### A typical workflow would look like this:

![group_page_step](https://github.com/Stephane-S/Simplot_PlusPlus/blob/master/Docs/images/group_page_steps.png)

1. Select your sequence file (DNA or AA) in an accepted format (Fasta, Nexus, Pir, Phylip, Stockholm or Clustal) through the **File browser** button.
2. Once the file is loaded, the sequence IDs will appear in the **Ungrouped Sequences** section, on the bottom right.
3. Groups can be created and deleted, and sequence IDs can be moved from the **Ungrouped Sequences** section to the **Group section**.
    - Groups can be renamed by clicking on their names.
    - Group colors can be modified by clicking on the corresponding colored circles.
    - A group that has no sequences will prevent the user from running most of the available analyses.
    - A minimum of two groups containing at least 1 sequence each are necessary to run an analysis.
4. Once your groups are created, customized, and are ready to be used, we suggest saving them locally using the **Save groups to .Nexus** button.
    - This feature will save your initial data in the Nexus format along with the group content, allowing you to skip the group creation process the next time you start SimPlot++.
5. Once these steps are completed, you can run your analysis of choice by selecting it on the top bar of the application.

Below is a summary of the steps presented:

![group page gif](https://github.com/Stephane-S/Simplot_PlusPlus/blob/master/Docs/images/group_page_steps_gif.gif)



# SimPlot analysis

## Methodology
A SimPlot analysis uses a window of a specified size and a specified advancement step to slide this window over the Multiple Sequences Alignment (MSA). Every sub-MSA covered by the window is extracted and a distance matrix based on a selected distance model is generated. This distance matrix is then used to produce a similarity plot for every consensus sequence against the reference sequence chosen by the user. The variations in similarity between the reference sequence and the consensus sequences can be used, for example, to detect potential recombination events.

### Main features
- 43 DNA distance and 20 amino acid distance models are available (including models from [Biopython](https://biopython.org/) and [Cogent3](https://cogent3.org/))
- Multiprocessing functionality is available
- MatPlotlib-based plots with a toolbar to easily customize and save the outputs in multiple formats
- Plots can be viewed in a pop-up window (with the toolbar)
- A new quality control window will open an interactive HTML page to access additional information with the distance calculability diagnostic

### Settings
**Window length**: Determines the size of the sliding window 

**Step**: Determines the size of the advancement step of the sliding window (with overlap)

**Strip gap**: Determines the maximum number of ambiguous positions allowed in a consensus sequence (optional)

**Multiprocessing**: Allows multiple windows to be analyzed simultaneously. Recommended for large datasets

**Distance Model**: 43 DNA models and 20 amino acid models available

### Simplot analysis example

![Simplot analysis](https://github.com/Stephane-S/Simplot_PlusPlus/blob/master/Docs/images/simplot_gif.gif)

## Quality control tool
A new feature of SimPlot++ is the quality control feature for the Simplot analysis allowing the user to visualize gap-related data (such as the regions where the number of gaps in the consensus sequence was higher than the gap threshold permitted). 

Overall data completeness (whether genetic distances were successfully computed or not in each window) can also be viewed through this feature.

Since certain models can generate errors when computing genetically distant sequences (divisions by zero, log of negative numbers, etc.), it is recommended to use this feature to check if such issues happened. If it did, it is recommended to modify the analysis parameters, consensus groups, consensus threshold, or the distance model used. As a general rule, simpler models tend to be more lenient. 



# Similarity networks

The sequence similarity network analysis is an interactive representation of a SimPlot analysis using a window in which every group (including the reference group) is represented by a network node. These nodes are connected by an edge depending on the calculated global (over the whole sequence) or local (over sub-sequences of a selected length) similarity. 

By adjusting the minimum similarity threshold required to show each of the edge types (global and local), it is possible to get a better insight on the relationships between every group. Furthermore, the network similarity representation can be limited to a specific range of the full MSA (in order to analyze a gene or region of interest). 

Datatables allows the user to view the most important similarity regions between the network nodes (i.e. MSA sequences or sub-sequences). The results of the Proportion test are also available in a datatable (discussed in more details in the statistical methods section).

The graph data and visualization can be saved in an HTML file. The graph itself can be saved as either a .png or .svg (the option is in the user preference page) directly from the toolbox in the HTML file.

### Similarity network output example

![similarity network](https://github.com/Stephane-S/Simplot_PlusPlus/blob/master/Docs/images/newtwork_gif.gif)



# BootScan analysis

## Methodology
Bootscanning is a pipeline consisting of 4 main steps, all done using a sliding window analysis (as in the SimPlot analysis).
### Steps
1. The subsequences extracted from the consensus groups are bootstrapped N times.
2. For each of the N bootstrapped sub-MSAs, a distance matrix is generated.
3. A phylogenetic tree is inferred for each distance matrix (either with Neighbor-Joining or UPGMA).
4. The conflicting phylogenetic signals are quantified and expressed as the % of trees where each sequence is the nearest neighbor of the reference sequence. 

### Main features
- 43 DNA distance models are available for generating the distance matrices
- Multiprocessing functionality is available
- MatPlotlib-based plots with a toolbar to easily customize and save the outputs in multiple formats
- Plots can be viewed in a pop-up window (with the toolbar)

### Settings
**Bootstrap**: Number of replicates to be generated for each sub-MSA (each position of the sliding window)

**Tree model**: Neighbor-Joining or UPGMA

**Window length**: Size of the sliding window 

**Step**: Sliding window advancement step

**Distance Model**: 43 DNA substitution models are available

**Multiprocessing**: Allows multiple windows to be analyzed simultaneously (recommended for large datasets)

### BootScan analysis example

![Bootscan gif](https://github.com/Stephane-S/Simplot_PlusPlus/blob/master/Docs/images/bootscan_gif.gif)



# Findsites

The FindSites scan is used for locating possible regions of recombination by identifying informative sites. The first step of the analysis is to select a sequence assumed to be originated from a recombination event as well as two sequences of interest (one from each of the two possible parental evolutionary lines), and a fourth sequence as an outgroup. Informative sites will be identified as those where, at the same position, two of the sequences share the same nucleotide, and the other two sequences share another (different) nucleotide.

### FindSites example
![Findsite](https://github.com/Stephane-S/Simplot_PlusPlus/blob/master/Docs/images/findsite.gif)



# Detection of recombination

Statistical tests for detecting recombination events from the PhiPack package by Trevor Bruen et al. have been implemented in SimPlot++. The multiprocessing option is recommended for faster computation. 

The Phi, Phi-profile, Max χ2 and NSS tests are available for both the ungrouped (raw sequences) and grouped consensus sequences. 

Additional information on these tests can be found [here](https://www.researchgate.net/publication/229005330_PhiPack_PHI_test_and_other_tests_of_recombination).



Moreover, a new simple Proportion test has been designed as a complement to the traditional SimPlot analysis in order to identify quickly the most likely mosaic regions (i.e. possible recombination events) in the grouped sequences. This test is based on the proportion of genetic distances extracted from the SimPlot distance matrices. The Proportion score is an indicator of the signal strength but should not be always considered as a recombination signal.

### Example Output
![recombination](https://github.com/Stephane-S/Simplot_PlusPlus/blob/master/Docs/images/recomb_gif.gif)

# Contact
Please email us at : <samson.stephane.3@courrier.uqam.ca> or <makarenkov.vladimir@uqam.ca> for any question or feedback.




