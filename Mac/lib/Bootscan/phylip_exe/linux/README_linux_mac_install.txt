For non-windows OS, the PHYLIP executables used by SimPlot++ must be generated locally through makefile.

Steps:
1. extract the phylip-3.697_simplot.tar.xz file
2. run either the Makefile.unx or Makefile.osx depending on your OS with a Makefile call on your terminal.
3. a resulting exe folder containing a consense, dnadist, neighbor and seqboot executable should be created
4. move these 4 files to the src/lib/Bootscan/phylip_exe/linux folder
5. done

* if any issue arises with the creating of the PHYLIP files, they can also be procured at https://evolution.genetics.washington.edu/phylip/getme-new1.htm
and dragged to the step 4 folder.
