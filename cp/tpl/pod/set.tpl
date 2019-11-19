<div id="incp-podset-alert"></div>
<div id="incp-podset"></div>    

<script id="incp-podset-tpl" type="text/html">

<input type="hidden" name="meta_id" value="{[=it.meta.id]}">

<div class="form-horizontal incp-form">

    <div class="form-group">
      <label class="col-sm-2 control-label">Name</label>
      <div class="col-sm-10">
        <input type="text" class="form-control" name="meta_name" value="{[=it.meta.name]}">
      </div>
    </div>

    <div class="form-group">
      <label class="col-sm-2 control-label">Status</label>
      <div class="col-sm-10">
      {[~it._statusls :v]}
        <span class="incp-form-checkbox checkbox-inline">
          <input type="radio" name="status_desiredPhase" value="{[=v.phase]}" {[ if (v.phase == it.status.desiredPhase) { ]}checked="checked"{[ } ]}> {[=v.title]}
        </span>
      {[~]}
      </div>
    </div>

    <div class="form-group">
      <label class="col-sm-2 control-label">Template</label>
      <div class="col-sm-10">
        <select name="spec_pod_id" class="form-control" onchange="inCpPod.SetFormSpecChange(this)">
          {[~it._specs.items :v]}
          <option value="{[=v.meta.id]}" {[ if (v.meta.id == it.spec.meta.id) { ]}selected="selected"{[ } ]}>{[=v.meta.name]}</option>
          {[~]}
        </select>
      </div>
    </div>

    <div class="form-group">
      <label class="col-sm-2 control-label"></label>
      <div class="col-sm-10">
        <div id="incp-pod-spec-info"></div>
      </div>
    </div>
</div>
</script>

<script id="incp-pod-spec-info-tpl" type="text/html">
  <table class="table table-condensed">
    {[?it.labels]}
    <tr>
      <td><strong>Labels</strong></td>
      <td>
        <table width="100%">
        <tbody>
          {[~it.labels :v]}
          <tr>
            <td>{[=v.key]}</td>
            <td>{[=v.val]}</td>
          </tr>
          {[~]}
        </tbody>
        </table>
      </td>
    </tr>
    {[?]}

    <tr>
      <td><strong>Box Name</strong></td>
      <td>{[=it.box.meta.name]}</td>
    </tr>
    <tr>
      <td><strong>Box Image</strong></td>
      <td>{[=it.box.image.meta.name]}</td>
    </tr>
    <tr>
      <td><strong>Quota</strong></td>
      <td>
        <table class="table table-condensed">
        <thead>
          <tr>
            <th>CPU Cores</th>
            <th>RAM (MB)</th>
            <th>Storage (MB)</th>    
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{[=it.box.resource.cpu_num]}</td>
            <td>{[=it.box.resource.mem_size]}</td>
            <td>{[=it.box.resource.stor_size]}</td>
          </tr>
        </tbody>
        </table>
      </td>
    </tr>
    {[?it.box.ports]}
    <tr>
      <td><strong>Network Ports</strong></td>
      <td>
        <table class="table table-condensed">
        <thead>
          <tr>
            <th>Box Port</th>
            <th>Host Port</th>
          </tr>
        </thead>
        <tbody>
          {[~it.box.ports :v2]}
          <tr>
            <td>{[=v2.boxPort]}</td>
            <td>Auto</td>
          </tr>
          {[~]}
        </tbody>
        </table>
      </td>
    </tr>
    {[?]}

  </table>
</script>
