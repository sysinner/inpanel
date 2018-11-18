
<div id="incp-app-specset-vcsset-alert" class="alert alert-danger hide"></div>

<div id="incp-app-specset-vcsset">
<table class="incp-formtable">
<tbody>

<tr>
  <td width="260px">Git Repo URL</td>
  <td>
    <input name="vcs_url" class="form-control form-control-sm" value="{[=it.url]}">
    <small class="form-text text-muted">Example: https://github.com/inpack/demo-web-go.git</small>
  </td>
</tr>

<tr>
  <td>Auth (optional)</td>
  <td>
    <table>
      <thead><tr>
        <th>Username</th>
        <th>Password</th>
      </tr></thead>
      <tbody>
      <tr>
        <td>
          <input name="vcs_auth_user" class="form-control form-control-sm" value="{[=it.auth_user]}">
        </td>
        <td>
          <input name="vcs_auth_pass" class="form-control form-control-sm" value="{[=it.auth_pass]}">
        </td>
      </tr>
      </tbody>
    </table>
  </td>
</tr>


<tr>
  <td>Branch Name</td>
  <td>
    <input name="vcs_branch" class="form-control form-control-sm" value="{[=it.branch]}">
  </td>
</tr>

<tr>
  <td>Clone to new Directory</td>
  <td>
    <div class="input-group input-group-sm">
      <div class="input-group-prepend">
        <span class="input-group-text">/home/action/</span>
      </div>
      <input name="vcs_dir" type="text" class="form-control form-control-sm" value="{[=it.dir]}">
    </div>
  </td>
</tr>


<tr>
  <td>Update Plan</td>
  <td>
    <select name="vcs_plan" class="form-control form-control-sm">
      <option value="on_boot" {[if (it.plan == "on_boot") {]}selected{[}]}>On Boot</option>
      <option value="on_update" {[if (it.plan == "on_update") {]}selected{[}]}>On Repo Updated</option>
    </select>
  </td>
</tr>

<tr>
  <td>Triggers after Updated (optional)</td>
  <td>
    <table>
      <thead><tr>
        <th>Auto restart Executor (name)</th>
        <th>Auto restart Pod (Yes/No)</th>
      </tr></thead>
      <tbody>
      <tr>
        <td>
          <input name="vcs_hook_exec_restart" class="form-control form-control-sm" value="{[=it.hook_exec_restart]}" placeholder="Enter executor name">
        </td>
        <td>
          <select name="vcs_hook_pod_restart" class="form-control form-control-sm">
            <option value="yes" {[if (it.hook_pod_restart === true) {]}selected{[}]}>Yes</option>
            <option value="no" {[if (it.hook_pod_restart !== true) {]}selected{[}]}>No</option>
          </select>
        </td>
      </tr>
      </tbody>
    </table>
  </td>
</tr>


</tbody>
</table>
</div>

