import { ScanningColorMapper } from "./scanning_color_mapper";
import { min, max, bin_counts, map, interpolate } from "../../core/util/arrayable";
import { linspace, range, cumsum, uniq } from "../../core/util/array";
import * as p from "../../core/properties";
import { logger } from "../../core/logging";
export class EqHistColorMapper extends ScanningColorMapper {
    constructor(attrs) {
        super(attrs);
    }
    static init_EqHistColorMapper() {
        this.define({
            bins: [p.Int, 256 * 256],
        });
    }
    scan(data, n) {
        const low = this.low != null ? this.low : min(data);
        const high = this.high != null ? this.high : max(data);
        const nbins = this.bins;
        const eq_bin_edges = linspace(low, high, nbins + 1);
        const hist = bin_counts(data, eq_bin_edges);
        const eq_bin_centers = new Array(nbins);
        for (let i = 0, length = eq_bin_edges.length; i < length - 1; i++) {
            const left = eq_bin_edges[i];
            const right = eq_bin_edges[i + 1];
            eq_bin_centers[i] = (left + right) / 2;
        }
        // CDFs
        const cdf = cumsum(hist);
        const cdf_max = cdf[cdf.length - 1];
        const norm_cdf = map(cdf, (x) => x / cdf_max);
        // Iteratively find as many finite bins as there are colors
        let finite_bins = n - 1;
        let binning = [];
        let iterations = 0;
        let guess = n * 2;
        while ((finite_bins != n) && (iterations < 4) && (finite_bins != 0)) {
            const ratio = guess / finite_bins;
            if (ratio > 1000) {
                // Abort if distribution is extremely skewed
                break;
            }
            guess = Math.round(Math.max(n * ratio, n));
            // Interpolate
            const palette_edges = range(0, guess);
            const palette_cdf = map(norm_cdf, (x) => x * (guess - 1));
            binning = interpolate(palette_edges, palette_cdf, eq_bin_centers);
            // Evaluate binning
            const uniq_bins = uniq(binning);
            finite_bins = uniq_bins.length - 1;
            iterations++;
        }
        if (finite_bins == 0) {
            binning = [low, high];
            for (let j = 0; j < n - 1; j++)
                binning.push(high);
        }
        else {
            binning = binning.slice(binning.length - n - 1);
            if (finite_bins != n)
                logger.warn("EqHistColorMapper warning: Histogram equalization did not converge.");
        }
        return { min: low, max: high, binning };
    }
}
EqHistColorMapper.__name__ = "EqHistColorMapper";
EqHistColorMapper.init_EqHistColorMapper();
//# sourceMappingURL=eqhist_color_mapper.js.map