<div id="incp-podsetinfo-alert"></div>
<div id="incp-podsetinfo">  

<div class="">
    <input type="hidden" name="meta_id" value="{[=it.pod.meta.id]}">

    <div class="l4i-form-group">
      <label class="">Name</label>
      <div class="">
        <input type="text" class="form-control" name="meta_name" value="{[=it.pod.meta.name]}">
      </div>
    </div>

    <div class="l4i-form-group">
      <label class="">Spec</label>
      <div class="input-group mb-3">
        <input type="text" class="form-control " value="{[=it._spec_summary]}" readonly>
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" onclick="inCpPod.SpecSet('{[=it.pod.meta.id]}')">Change Spec</button>
        </div>
      </div>
    </div>

    <div class="l4i-form-group">
      <label class="">Operate</label>
      <div class="">
      {[~it._op_actions :v]}
        <span class="incp-form-checkbox checkbox-inline">
          <input type="radio" name="operate_action" value="{[=v.action]}" {[ if (v.active) { ]}checked="checked"{[ } ]}> {[=v.title]}
        </span>
      {[~]}
      </div>
    </div>
</div>
</div>

