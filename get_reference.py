#!/usr/bin/env python
import subprocess
from argparse import ArgumentParser
from pathlib import Path

from urllib.request import urlopen

HERE = Path(__file__).absolute()
PROJECT_ROOT = HERE.parent

DEFAULT_REPS = 100
LAMBDA = 2000
FRACTION = 0.9
DATA_ROOT = PROJECT_ROOT / 'data'
TEST_SKELETON = 3034133

BRANCH = "master"
REPO_URL = f"https://raw.githubusercontent.com/catmaid/CATMAID/{BRANCH}"
CATMAID_LIB_URL = REPO_URL + "/django/applications/catmaid/static/libs/catmaid"

ARBOR_URL = CATMAID_LIB_URL + "/Arbor.js"
ARBOR_PARSER_URL = CATMAID_LIB_URL + "/arbor_parser.js"
SYNAPSE_CLUSTERING_URL = CATMAID_LIB_URL + "/synapse_clustering.js"


def get_file(url):
    response = urlopen(url)
    b = response.read()
    return b.decode()


template_path = PROJECT_ROOT / "template.js"
skel_root = DATA_ROOT / str(TEST_SKELETON)
arbor_path = skel_root / "compact-arbor.json"
skeleton_path = skel_root / "compact-skeleton.json"
results_path = skel_root / "results"

template = template_path.read_text()


def main(reps=DEFAULT_REPS, force=False, results=True, bench=True):
    if not force and results_path.is_dir():
        return

    arbor_ref_path = results_path / "arbor"
    parser_ref_path = results_path / "arbor_parser"
    clustering_ref_path = results_path / "synapse_clustering"

    s = template.format(
        arbor_js=get_file(ARBOR_URL),
        arbor_parser_js=get_file(ARBOR_PARSER_URL),
        synapse_clustering_js=get_file(SYNAPSE_CLUSTERING_URL),
        LAMBDA=LAMBDA,
        FRACTION=FRACTION,
        REPS=reps or DEFAULT_REPS,
        results_path=results_path,
        arbor_ref_path=arbor_ref_path,
        parser_ref_path=parser_ref_path,
        clustering_ref_path=clustering_ref_path,
        arbor_path=arbor_path,
        skeleton_path=skeleton_path,
    )
    # for path in [results_path, arbor_ref_path, parser_ref_path, clustering_ref_path]:
    #     path.mkdirs(exist_ok=True, parents=True)

    node_root = PROJECT_ROOT / "node"
    script_path = node_root / "impl.js"

    with open(script_path, "w") as f:
        f.write(s)

    if results:
        subprocess.run(["node", "--use_strict", str(node_root / "results.js")])
    if bench:
        subprocess.run(["node", "--use_strict", str(node_root / "bench.js")])


if __name__ == "__main__":
    parser = ArgumentParser("get_reference")
    parser.add_argument("-r", "--reps", type=int, default=DEFAULT_REPS, help="number of repeats for bechmarks")
    parser.add_argument("-f", "--force", action="store_true", help="Replace existing")
    parser.add_argument('--no_results', action="store_true", help="do not calculate results")
    parser.add_argument('--no_bench', action="store_true", help="do not benchmark")

    parsed_args = parser.parse_args()

    main(
        parsed_args.reps,
        parsed_args.force,
        not parsed_args.no_results,
        not parsed_args.no_bench
    )
