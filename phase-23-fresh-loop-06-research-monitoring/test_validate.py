import subprocess, shutil, json, os, tempfile, sys
HERE = os.path.dirname(os.path.abspath(__file__))
def run_validate(workdir):
    # validate.py resolves data paths from its own location, so run the copy in workdir
    return subprocess.run([sys.executable, os.path.join(workdir, 'validate.py')], cwd=workdir, capture_output=True, text=True).returncode
# 1) passes on real data
assert run_validate(HERE) == 0, 'validate.py should pass on real repo data'
# 2) fails on tampered LOOP_STATE.json with a duplicated id
with tempfile.TemporaryDirectory() as d:
    for f in os.listdir(HERE):
        src = os.path.join(HERE, f)
        if os.path.isfile(src):
            shutil.copy(src, os.path.join(d, f))
    p = os.path.join(d, 'LOOP_STATE.json')
    data = json.load(open(p))
    if isinstance(data.get('seen_ids'), list) and data['seen_ids']:
        data['seen_ids'].append(data['seen_ids'][0])  # duplicate
    else:
        data['seen_ids'] = ['dup', 'dup']
    json.dump(data, open(p, 'w'))
    assert run_validate(d) != 0, 'validate.py should fail on duplicated seen_id'
print('ALL TESTS PASSED')
