<div id="loscp-podsetinfo-alert"></div>
<div id="loscp-podsetinfo">  

<div class="">
    <input type="hidden" name="meta_id" value="{[=it.pod.meta.id]}">

    <div class="l4i-form-group">
      <label class="">Name</label>
      <div class="">
        <input type="text" class="form-control" name="meta_name" value="{[=it.pod.meta.name]}">
      </div>
    </div>

    <div class="l4i-form-group">
      <label class="">Status</label>
      <div class="">
      {[~it._op_actions :v]}
        <span class="loscp-form-checkbox checkbox-inline">
          <input type="radio" name="operate_action" value="{[=v.action]}" {[ if (v.action == it.pod.operate.action) { ]}checked="checked"{[ } ]}> {[=v.title]}
        </span>
      {[~]}
      </div>
    </div>
</div>
</div>


<script id="loscp-pod-spec-info-tpl" type="text/html">
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
  </table>
</script>
