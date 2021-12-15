﻿﻿﻿﻿﻿<h1  align="center">SimPlot++</h1>
<h2  align="center">Recombination detection software</h2>

<details open>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About the Project</a>
    </li>
    <li>
      <a href="#Installation">Installation</a>
      <ul>
        <li><a href="#Windows">Windows</a></li>
        <li><a href="#Linux/UNIX">Linux/UNIX</a></li>
          <li><a href="#Mac">Mac</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
      <ul>
        <li><a href="#Group Page">Group Page</a></li>
        <li><a href="#SimPlot">SimPlot</a></li>
        <li><a href="#BootScan">BootScan</a></li>
        <li><a href="#FindSite">FindSite</a></li>
        <li><a href="#Similarity Network">Similarity Network</a></li>
        <li><a href="#Statistical methods">Statistical methods</a></li>
      </ul>
    <li><a href="#License">License</a></li>
  </ol>
</details>


# About The Project

Simplot++ is a multi-platform software designed by Stéphane Samson, Étienne Lord and Vladimir Makarenkov (Université du Québec à Montréal) as a tool for the detection of recombination events for both nucleotide and protein multiple sequence alignments. Compared to previous software such as SimPlot, RDP4 and RAT, SimPlot++ aims to improve the transparency of analysis, plot qualities and ease of customization.

SimPlot++ offers the following features:
<ul>  
<li>Create and save consensus group</li>  
<li>Execute a SimPlot analysis</li>  
<li>Execute a BootScan analysis</li>  
<li>Identify informative sites</li>  
<li>Create a similarity network</li>
<li>Run Phi, NSS and Max-Chi statistical tests</li>    
</ul>

# Installation
### Windows

SimPlot++ can be used either through the provided executable or as a script by downloading the dependencies and running the main.py file.

### Linux/UNIX



### Mac



# Usage

SimPlot, an interactive 32-bit software program for Microsoft Windows computers, was created to plot similarity versus position ([41](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC103818/#B41)) and is similar in purpose to the Recombination Inference Program (RIP) for UNIX computers ([52](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC103818/#B52))

### Group Page
The group page allow users to load multiple sequences files (fasta, nexus, pir, phylip, stockholm or clustal format) and manually organize the individual sequences in groups. For each of the groups created by the user, a consensus sequence will be produced. The % threshold for this consensus can be modified in the preference tab. 
These consensus groups are essential for the SimPlot, BootScan and Similarity Network analysis. The groups can be saved to a nexus file to avoid recreating them every time. 

### SimPlot

This method consists of using a sliding window across each consensus sequences in order to extract subsequences. These subsequences are then used to generate distance matrices and plot the similarity between every group and a chosen reference group for each window. Variations in similarity between a reference and the other sequences can help detect potential recombination events.



A new feature of SimPlot++ is the quality control feature for the Simplot analysis where the user can view gap-related informations (such as the regions where the amount of gaps in the consensus sequence was higher than the gap threshold). 

Overall data completeness (whether genetic distances were successfully computed or not in each window) can also be viewed through this feature.

Since certain models can throw errors when computing genetically distant sequences (divisions by zero, log of negative numbers, etc.), it is recommended to use this feature to check if such issues happened. If it did, either modify the analysis parameters, consensus groups, consensus threshold, or distance model used depending on the analysis needs. As a general rule, simpler models are more lenient. 

##### Settings:

**Distance models**:

| DNA   models |            | Protein   models |            |
| :----------: | :--------: | :--------------: | :--------: |
|   Hamming    |    F84     |     Hamming      |   logdet   |
|     JC69     |    TN93    |       JC69       | paralinear |
|    Kimura    |   HKY85    |      Kimura      |  percent   |
|    Tamura    |    GTR     |      DSO78       |            |
|  TajimaNei   |    ssGN    |       AH96       |            |
| JinNeiGamma  | paralinear |  AH96 mtmammals  |            |
|    LogDet    |  percent   |      JTT92       |            |
|     F81      |            |       WAG        |            |

**Window length**: Determines the size of the sliding window 

**Step**: Determines how much the window will slide very iteration (with overlap)

**Strip gap**: Determines the maximum amount of ambiguous positions allowed in a consensus sequence to be included (optional)

**Multiprocessing**: Allows multiple windows to be analyzed simultaneously. Recommended for big data sets.



### BootScan

This analysis consists of employing the PHYLIP suite of software and a sliding window similar to the SimPlot method in order to identify the recombinations. For every subsequence extracted with the sliding window,  

For each window during the analysis, the sub-sequences extracted are first resampled by bootstrapping. The multiplied dataset is then used to generate
distance matrices according to a model specified by the user (JC69, Kimura, F84 or Logdet). These distance matrices are then used to produce phylogenetic trees (Neighbor-Joining or UPGMA).

The topologies of each tree from the multiplied dataset are then analyzed in order to determine for each window which consensus sequence is most similar to the reference sequence.

The resulting graph represents the percentage of trees where each sequence was most similar to the reference sequence, for each window.



##### Settings:

**Bootstrap**: Amounts of replications to generate for each dataset (window) 

**Tree model**: Neighbor-Joining or UPGMA

**Window length**: Determines the size of the sliding window 

**Step**: Determines how much the window will slide very iteration (with overlap)

**Distance Model**: JC69, Kimura, F84 or Logdet

**t/t ratio**  expected ratio of transitions to transversions

### FindSite

The FindSite scan is used for locating possible regions of recombination by identifying informative sites. The first step of the analysis is to select a sequence suspected of having originated of a recombination event as well as two sequences of interest (one from each of the two suspected parental evolutionary lines) and a fourth from an evolutionarily unrelated sequence to the previous three (an outgroup). Informative sites will be identified as those where, at the same position, two of the sequences share the same nucleotide, and that the other two sequences share another different nucleotide.

### Similarity Network

The similarity network analysis is an interactive representation of a SimPlot analysis where every group (without a chosen reference group) is represented by a node. These nodes are connected by their global (overall sequence) and local (per window) similarities. 

By adjusting the minimum similarity threshold required to show each of these edge types, it is possible to get a better overview look of the relationships between every group. Furthermore, the graph representation can be limited to a specific range of the full sequences, in order to isolate a gene or region of interest. 

Datatables allows the user to view the raw data represented visually in the graph. Results of the Proportion test are also available in a Datatable (discussed in more details in the statistical methods section below).

The graph data and visualisation are stored in an HTML file that can be downloaded and shared while retaining the interactive features.

By default the HTML file will open in the default browser. For technical reasons, the HTML can only be shown directly in the GUI through the script version (not the executable) by manually switching the `self.show_network_in_gui` variable in main.py to True. 

### Statistical methods

Statistical tests for the detection of recombination events from the PhiPack package by Trevor Bruen have been implemented in SimPlot++. This implementation includes a graphical interface in order to simplify it's usage. The multiprocessing option is recommended for faster results. 

 The Phi , Phi profile, Max χ2 and NSS tests are available for both the ungrouped (raw sequences) and grouped consensus sequences. 

Additional information on these tests can be found [here](https://www.researchgate.net/publication/229005330_PhiPack_PHI_test_and_other_tests_of_recombination).



Additionally, a new proportion test has been designed as a complement to the traditional SimPlot analysis in order to identify the most likely mosaic regions in the grouped sequences. It is an indirect test based on the proportion of genetic distances extracted from the SimPlot distance matrices. The score is an indicator of the signal strength but should not be taken as a recombination signal. It's purpose is to help guide the user and highlight the most promising leads.



## License









