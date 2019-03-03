<div id="incp-app-specset-alert" class="alert alert-danger hide"></div>

<div id="incp-app-specset" class="incp-div-light" style="box-sizing: border-box;">loading</div>
<style>
#incp-app-specset .btn-sm {
  padding: 3px 10px;
  font-size: 12px;
  line-height: 120%;
}
#incp-app-specset button.icon-x20 {
  padding: 0px;
  width: 22px;
  height: 22px;
  font-size: 11px;
  text-align: center;
}
#incp-app-specset th {
  font-weight: normal;
}
#incp-app-specset .card-body {
  padding: 0 10px;
}
</style>
<script id="incp-app-specset-tpl" type="text/html">
<div class="card">
<div class="card-header">{[=it.actionTitle]}</div>
<div class="card-body">

<table class="incp-formtable">
<tbody>

<tr>
  <td width="260px">Name</td>
  <td width="30px"></td>
  <td>
    <input name="meta_name" class="form-control form-control-sm" value="{[=it.spec.meta.name]}">
  </td>
</tr>

{[if (it.spec.meta.id && it.spec.meta.id.length > 0) {]}
<input type="hidden" name="meta_id" value="{[=it.spec.meta.id]}">
{[} else {]}
<tr>
  <td>ID</td>
  <td></td>
  <td><input name="meta_id" class="form-control form-control-sm" value="{[=it.spec.meta.id]}"></td>
</div>
{[}]}

<tr>
  <td>Description</td>
  <td></td>
  <td><input name="description" class="form-control form-control-sm" value="{[=it.spec.description]}"></td>
</div>

<!-- <tr>
  <td>Bound Spec Plans (draft)</td>
  <td><input name="draft_bound_plans" class="form-control form-control-sm" value="{[=it.spec.draft_bound_plans]}"></td>
</div> -->


<tr>
  <td>
    Imported Package
  </td>
  <td>
    <button class="btn btn-default icon-x20" onclick="inCpAppSpec.SetPackageSelect()">
      <i class="fa fa-plus"></i>
    </button>
  </td>
  <td>
    <div id="incp-app-specset-ipmls-msg" class="badge badge-secondary">no package yet ...</div>
    <div id="incp-app-specset-ipmls"></div>
  </td>
</tr>


<tr>
  <td>
    Imported Git Repo
  </td>
  <td>
    <button class="btn btn-default icon-x20" onclick="inCpAppSpec.SetVcsSet()">
      <i class="fa fa-plus"></i>
    </button>
  </td>
  <td>
    <div id="incp-app-specset-vcsls-msg" class="badge badge-secondary">no repo yet ...</div>
    <div id="incp-app-specset-vcsls"></div>
  </td>
</tr>

<tr>
  <td>
    Internally dependent AppSpec
  </td>
  <td>
    <button class="btn btn-default icon-x20" onclick="inCpAppSpec.SetDependSelect()">
      <i class="fa fa-plus"></i>
    </button>
  </td>
  <td>
    <div id="incp-app-specset-depls-msg" class="badge badge-secondary">no AppSpec yet ...</div>
    <div id="incp-app-specset-depls"></div>
  </td>
</tr>

<tr>
  <td>
    Remotely dependent AppSpec
  </td>
  <td>
    <button class="btn btn-default icon-x20" onclick="inCpAppSpec.SetDepRemoteSelect()">
      <i class="fa fa-plus"></i>
    </button>
  </td>
  <td>
    <div id="incp-app-specset-depremotes-msg" class="badge badge-secondary">no AppSpec yet ...</div>
    <div id="incp-app-specset-depremotes"></div>
  </td>
</tr>

<tr>
  <td>
    Script Executors
  </td>
  <td>
    <button class="btn btn-default icon-x20" onclick="inCpAppSpec.SetExecutorSet()">
      <i class="fa fa-plus"></i>
    </button>
  </td>
  <td>
    <div id="incp-app-specset-executorls-msg" class="badge badge-secondary">no executor yet ...</div>
    <div id="incp-app-specset-executorls"></div>
  </td>
</tr>

<tr>
  <td>
    Services
  </td>
  <td>
    <button class="btn btn-default icon-x20" onclick="inCpAppSpec.SetServicePortAppend()">
      <i class="fa fa-plus"></i>
    </button>
  </td>
  <td>
    <table>
      <thead>
        <tr>
          <th width="33%">Name (tcp,http, ...)</th>
          <th width="33%">Pod Port (1025 ~ 65535)</th>
          {[? it.spec._host_port_enable]}
          <th>Host Port (1 ~ 9999)</th>
          {[??]}
          <th></th>
          {[?]}
          <th width="30px"></th>
        <tr>
      </thead>
      <tbody id="incp-app-specset-serviceports">
        {[~it.spec.service_ports :vp]}
        <tr class="incp-app-specset-serviceport-item">
          <td>
            <input name="sp_name" type="text" value="{[=vp.name]}" class="form-control form-control-sm">
          </td>
          <td>
            <input name="sp_box_port" type="text" value="{[=vp.box_port]}" class="form-control form-control-sm">
          </td>
          {[? it.spec._host_port_enable]}
          <td>
            <input name="sp_host_port" type="text" value="{[=vp.host_port]}" class="form-control form-control-sm">
          </td>
          {[??]}
          <td></td>
          {[?]}
          <td align="right">
            <button class="btn btn-default icon-x20" onclick="inCpAppSpec.SetServicePortDel(this)">
              <i class="fa fa-times"></i>
            </button>
          </td>
        </tr>
        {[~]}
      </tbody>
    </table>
  </td>
</tr>


<tr>
  <td>Minimum Requirements</td>
  <td></td>
  <td>
    <table>
    <tr>
      <td width="33%">
        <label>CPU cores (0.1 ~ 16)</label>
        <div class="input-group input-group-sm">
          <input type="text" class="form-control form-control-sm" name="exp_res_cpu_min" value="{[=it.spec.exp_res._cpu_min]}">
          <div class="input-group-append"><div class="input-group-text">Cores</div></div>
        </div>
      </td>
      <td width="33%">
        <label>Memory Size</label>
        <div class="input-group input-group-sm">
          <input type="text" class="form-control form-control-sm" name="exp_res_mem_min" value="{[=it.spec.exp_res.mem_min]}">
          <div class="input-group-append"><div class="input-group-text">MB</div></div>
        </div>
      </td>
      <td>
        <label>System Volume Size</label>
        <div class="input-group input-group-sm">
          <input type="text" class="form-control form-control-sm" name="exp_res_vol_min" value="{[=it.spec.exp_res.vol_min]}">
          <div class="input-group-append"><div class="input-group-text">GB</div></div>
        </div>
      </td>
    </tr>
    </table>
  </td>
</tr>


{[? it._multi_replica_enable]}
<tr>
  <td>Deployment Requirements</td>
  <td></td>
  <td>
    <table>
    <tbody>
    <tr>
      <td width="33%">Number of Replicas (1 ~ 256)</td>
      <td width="33%">System State</td>
      <td></td>
    </tr>
    <tr>
      <td>
        <div class="input-group input-group-sm">
          <div class="input-group-prepend">
            <div class="input-group-text">Min</div>
          </div>
          <input type="text" class="form-control" name="exp_deploy_rep_min" value="{[=it.spec.exp_deploy.rep_min]}">
          <div class="input-group-prepend">
            <div class="input-group-text">Max</div>
          </div>
          <input type="text" class="form-control" name="exp_deploy_rep_max" value="{[=it.spec.exp_deploy.rep_max]}">
        </div>
      </td>
      <td>
        <select name="exp_deploy_sys_state" class="form-control form-control-sm">
        {[~it._deploy_sys_states :v]}
        <option value="{[=v.value]}" {[if (it.spec.exp_deploy.sys_state == v.value) {]} selected{[}]}>{[=v.title]}</option>
        {[~]}
        </select>
      </td>
      <td></td>
    </tr>
    </tbody>
    </table>
  </td>
</tr>
{[?]}


<tr>
  <td>Allowed Roles</td>
  <td></td>
  <td>
    <span style="margin-right:10px">
      <input type="checkbox" name="" value="0" checked="checked" disabled> Owner
    </span>
    {[~it.spec._roles.items :v]}
    <span style="margin-right:10px">
      {[if (v._checked) {]}
      <input type="checkbox" name="roles" value="{[=v.id]}" checked="checked"> {[=v.name]}
      {[} else {]}
      <input type="checkbox" name="roles" value="{[=v.id]}"> {[=v.name]}
      {[}]}
    </span>
    {[~]}
  </td>
</tr>


<tr>
  <td>Comment</td>
  <td></td>
  <td>
    <input type="text" name="comment" class="form-control form-control-sm" value="{[=it.spec.comment]}">
  </td>
</tr>


<tr>
  <td></td>
  <td></td>
  <td>
    <button class="btn btn-primary" onclick="inCpAppSpec.SetCommit()">
      Save
    </button>
    <button class="btn btn-default" onclick="inCpAppSpec.ListRefresh()" style="margin-left:10px">
      Cancel
    </button>
  </td>
</tr>

</tbody>
</table>

</div>
</div>
</script>


<script id="incp-app-specset-depls-tpl" type="text/html">
{[? it.items && it.items.length > 0]}
<table>
  <thead><tr>
    <th>ID</th>
    <th>Name</th>
    <th>Version</th>
    <th></th>
  </tr></thead>
  <tbody>
  {[~it.items :v]}
  <tr id="incp-app-specset-depls-id{[=v.id]}">
    <td>{[=v.id]}</td>
    <td>{[=v.name]}</td>
    <td>{[=v.version]}</td>
    <td align="right">
      <button class="btn btn-default icon-x20" onclick="inCpAppSpec.SetDependRemove('{[=v.id]}')">
        <i class="fa fa-times"></i>
      </button>
    </td>
  </tr>
  {[~]}
  </tbody>
</table>
{[?]}
</script>


<script id="incp-app-specset-depremotes-tpl" type="text/html">
{[? it.items && it.items.length > 0]}
<table>
  <thead><tr>
    <th>ID</th>
    <th>Name</th>
    <th>Version</th>
    <th>Configs</th>
    <th></th>
  </tr></thead>
  <tbody>
  {[~it.items :v]}
  <tr id="incp-app-specset-depremote-id{[=v.id]}">
    <td>{[=v.id]}</td>
    <td>{[=v.name]}</td>
    <td>{[=v.version]}</td>
    <td>{[=v.configs.join(", ")]}</td>
    <td align="right">
      <button class="btn btn-default icon-x20" onclick="inCpAppSpec.SetDepRemoteRemove('{[=v.id]}')">
        <i class="fa fa-times"></i>
      </button>
    </td>
  </tr>
  {[~]}
  </tbody>
</table>
{[?]}
</script>

<script id="incp-app-specset-ipmls-tpl" type="text/html">
{[? it.items && it.items.length > 0]}
<table>
  <thead><tr>
    <th>Name</th>
    <th>Version</th>
    <th>Release</th>
    <th>Dist/Arch</th>
    <th>Volume</th>
    <th></th>
  </tr></thead>
  <tbody>
  {[~it.items :v]}
  <tr id="incp-app-specset-ipmls-name{[=v.name]}">
    <td>{[=v.name]}</td>
    <td>{[=v.version]}</td>
    <td>{[=v.release]}</td>
    <td>{[=v.dist]} / {[=v.arch]}</td>
    <td>/usr/sysinner/{[=v.name]}/{[=v.version]}</td>
    <td align="right">
      <button class="btn btn-default icon-x20" onclick="inCpAppSpec.SetPackageRemove('{[=v.name]}')">
        <i class="fa fa-times"></i>
      </button>
    </td>
  </tr>
  {[~]}
  </tbody>
</table>
{[?]}
</script>


<script id="incp-app-specset-vcsls-tpl" type="text/html">
{[? it.items && it.items.length > 0]}
<table>
  <thead><tr>
    <th>Repo URL</th>
    <th>Branch</th>
    <th>Clone Directory</th>
    <th></th>
  </tr></thead>
  <tbody>
  {[~it.items :v]}
  <tr>
    <td>{[=v.url]}</td>
    <td>{[=v.branch]}</td>
    <td>/home/action/{[=v.dir]}</td>
    <td align="right">
      <button class="btn btn-default icon-x20" " onclick="inCpAppSpec.SetVcsSet('{[=v.dir]}')">
        <i class="fa fa-edit"></i>
      </button>
      <button class="btn btn-default icon-x20" onclick="inCpAppSpec.SetVcsRemove('{[=v.dir]}')">
        <i class="fa fa-times"></i>
      </button>
    </td>
  </tr>
  {[~]}
  </tbody>
</table>
{[?]}
</script>

<script id="incp-app-specset-executorls-tpl" type="text/html">
{[~it :v]}
<div class="incp-app-specset-gn-box">
  <div class="head">
    <span class="title">{[=v.name]}</span>
    <span class="options">
      <button class="btn btn-default icon-x20" onclick="inCpAppSpec.SetExecutorSet('{[=v.name]}')">
        <i class="fa fa-edit"></i>
      </button>
      <button class="btn btn-default icon-x20" onclick="inCpAppSpec.SetExecutorRemove('{[=v.name]}')">
        <i class="fa fa-times"></i>
      </button>
    </span>
  </div>
  <div class="body">
    <table width="100%">
      <tr>
        <td width="120">ExecStart</td>
        <td><pre><code class="bash">{[=v.exec_start.trim()]}</code></pre></td>
      </tr>
      <tr>
        <td>ExecStop</td>
        <td><pre><code class="bash">{[=v.exec_stop.trim()]}</code></pre></td>
      </tr>
      <tr>
        <td>Priority</td>
        <td>{[=v.priority]}</td>
      </tr>
      <tr>
        <td>Plan</td>
        <td>
          {[if (v.plan.on_boot) {]}
            On Boot
          {[}]}
          {[if (v.plan.on_tick > 0) {]}
            On Tick {[=v.plan.on_tick]}
          {[}]}
        </tr>
    </table>
  </div>
</div>
{[~]}
</script>

<script id="incp-app-specset-serviceport-tpl" type="text/html">
<tr class="incp-app-specset-serviceport-item">
  <td>
    <input name="sp_name" type="text" value="" class="form-control form-control-sm">
  </td>
  <td>
    <input name="sp_box_port" type="text" value="" class="form-control form-control-sm">
  </td>
  {[? it._host_port_enable]}
  <td>
    <input name="sp_host_port" type="text" value="" class="form-control form-control-sm">
  </td>
  {[??]}
  <td></td>
  {[?]}
  <td align="right">
    <button class="btn btn-default icon-x20" onclick="inCpAppSpec.SetServicePortDel(this)">
      <i class="fa fa-times"></i>
    </button>
  </td>
</tr>
</script>
